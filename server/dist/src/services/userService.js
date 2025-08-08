import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, } from "../utils/jwt.js";
import config from "../config/config.js";
import { sendForgotPasswordEmail, sendUnlockAccountEmail, } from "../utils/sendMail.js";
import "../models/TravelList.js";
import "../models/Destination.js";
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 10 * 60 * 1000;
export const getAll = async () => {
    return await UserModel.find()
        .select("-password")
        .populate("ownedLists")
        .populate("collaboratingLists");
};
export const getUserById = async (id) => {
    try {
        const user = await UserModel.findById(id)
            .select("-password")
            .populate("ownedLists")
            .populate("collaboratingLists");
        return user;
    }
    catch (error) {
        throw error;
    }
};
export const getByEmail = async (email) => await UserModel.find({ email: email }).select("-password");
export const deleteUser = async (id) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return null;
        }
        return {
            success: true,
            message: "User deleted successfully",
        };
    }
    catch (error) {
        let message = "Internal server error";
        if (error && typeof error === "object" && "message" in error) {
            message = error.message;
        }
        return {
            success: false,
            message,
        };
    }
};
export const updateUser = async (id, payload) => {
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }
        // Update user fields
        Object.keys(payload).forEach((key) => {
            if (payload[key] !== undefined && user.schema.paths[key]) {
                user[key] = payload[key];
            }
        });
        const updatedUser = await user.save();
        return {
            success: true,
            data: updatedUser,
        };
    }
    catch (error) {
        let message = "Internal server error";
        if (error && typeof error === "object" && "message" in error) {
            message = error.message;
        }
        return {
            success: false,
            message,
        };
    }
};
export const register = async (payload) => {
    try {
        const { email, username } = payload;
        const dublicateUser = await UserModel.findOne({
            $or: [{ email }, { username }],
        });
        if (dublicateUser) {
            return {
                success: false,
                message: "Username or email already exist",
            };
        }
        const createdUser = await UserModel.create(payload);
        return {
            success: true,
            data: createdUser,
        };
    }
    catch (error) {
        console.log(error.message);
        return error.message || "Internal server error";
    }
};
export const login = async (credentials) => {
    const { email, password } = credentials;
    const user = await UserModel.findOne({ email });
    if (!user)
        throw new Error("Invalid credentials");
    if (!user.isVerified)
        throw new Error("User should be verified first");
    if (user.lockUntil && user.lockUntil > new Date()) {
        const unlockTime = new Date(user.lockUntil).toLocaleString();
        throw new Error(`User is locked. Try again after ${unlockTime}`);
    }
    if (user.provider == "google") {
        throw new Error("This account has been created with Google, please try sign in with Google");
    }
    else if (user.provider == "github") {
        throw new Error("This account has been created with GitHub, please try sign in with GitHub");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        if (user.loginAttempts >= MAX_ATTEMPTS) {
            user.lockUntil = new Date(Date.now() + LOCK_TIME);
            await user.save();
            const token = generateAccessToken({
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            }, "6h");
            const unlockAccountLink = `${config.SERVER_URL}/auth/unlock-account?token=${token}`;
            sendUnlockAccountEmail(user.email, user.fullName, user.lockUntil, unlockAccountLink);
            throw new Error("Too many login attempts. Account locked for 10 minutes. Check your email");
        }
        await user.save();
        throw new Error("Invalid credentials");
    }
    user.loginAttempts = 0;
    user.isBanned = false;
    user.lastLogin = new Date();
    await user.save();
    const accessToken = generateAccessToken({
        email: user.email,
        id: user.id,
        fullName: user.fullName,
    }, "6h");
    const refreshToken = generateRefreshToken({
        email: user.email,
        id: user.id,
        fullName: user.fullName,
    }, "7d");
    return {
        message: "User login successfully!",
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};
export const verifyEmail = async (token) => {
    const isValidToken = verifyAccessToken(token);
    if (isValidToken) {
        const { id } = isValidToken;
        const user = await UserModel.findById(id);
        if (user) {
            if (user.isVerified) {
                return {
                    success: false,
                    message: "email already has been verified",
                };
            }
            else {
                user.isVerified = true;
                await user.save();
                return {
                    success: true,
                    message: "email has been verified successfully!",
                };
            }
        }
    }
    else {
        throw new Error("invalid or expired token!");
    }
};
export const unlockAcc = async (token) => {
    const isValidToken = verifyAccessToken(token);
    if (isValidToken && isValidToken.id) {
        const { id } = isValidToken;
        const user = await UserModel.findById(id);
        if (user?.loginAttempts >= 3) {
            user.loginAttempts = 0;
            user.lockUntil = null;
            await user.save();
            return {
                message: "Account has been unlock manually successfully",
            };
        }
        else {
            return {
                message: "Account already has been unlocked",
            };
        }
    }
    else {
        throw new Error("Invalid or expired token");
    }
};
export const forgotPassword = async (email) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error("email does not exist!");
    }
    else {
        const token = generateAccessToken({
            id: user.id,
            email: user.email,
        }, "30m");
        const resetPasswordLink = `${config.CLIENT_URL}/auth/reset-password/${token}`;
        sendForgotPasswordEmail(email, user.fullName, resetPasswordLink);
    }
};
export const resetPass = async (newPassword, email) => {
    const user = await UserModel.findOne({ email: email });
    if (!user)
        throw new Error("user not found!");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();
    return user;
};
export const changeUserPassword = async (userId, oldPassword, newPassword) => {
    const user = await UserModel.findById(userId);
    if (!user)
        throw new Error("User not found");
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordCorrect)
        throw new Error("Old password is incorrect");
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;
    await user.save();
    return {
        message: "Password changed successfully",
        user,
    };
};
