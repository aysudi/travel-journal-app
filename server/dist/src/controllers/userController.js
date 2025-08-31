import { v2 as cloudinary } from "cloudinary";
import { getAll, getByEmail, deleteUser as deleteUserService, register, login, verifyEmail, unlockAcc, forgotPassword as forgotPasswordService, resetPass, getUserById, updateUser, changeUserPassword, } from "../services/userService.js";
import bcrypt from "bcrypt";
import formatMongoData from "../utils/formatMongoData.js";
import { generateAccessToken } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/sendMail.js";
import config from "../config/config.js";
import "../models/TravelList.js";
import "../models/Destination.js";
import UserModel from "../models/User.js";
export const getUsers = async (_, res, next) => {
    try {
        const users = await getAll();
        res.status(200).json({
            message: "Users retrieved seccessfully!",
            data: formatMongoData(users),
        });
    }
    catch (error) {
        next(error);
    }
};
export const getUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;
        const user = await getByEmail(email);
        if (!user) {
            res.status(404).json({
                message: "no such user with given email",
                data: null,
            });
        }
        else {
            res.status(200).json({
                message: "user retrieved successfully!",
                data: user,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
export const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        const formattedUser = formatMongoData(user);
        res.status(200).json({
            message: "User profile retrieved successfully",
            data: formattedUser,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;
        const currentUser = await getUserById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        const allowedFields = [
            "fullName",
            "username",
            "profileImage",
            "profileVisibility",
        ];
        const filteredData = {};
        allowedFields.forEach((field) => {
            if (updateData[field] !== undefined) {
                filteredData[field] = updateData[field];
            }
        });
        if (req.cloudinaryResult) {
            if (currentUser.public_id &&
                currentUser.public_id !== "" &&
                !currentUser.profileImage.includes("static.vecteezy.com")) {
                try {
                    await cloudinary.uploader.destroy(currentUser.public_id);
                }
                catch (error) {
                    console.error("Error deleting old image from Cloudinary:", error);
                }
            }
            filteredData.profileImage = req.cloudinaryResult.secure_url;
            filteredData.public_id = req.cloudinaryResult.public_id;
        }
        if (Object.keys(filteredData).length === 0) {
            return res.status(400).json({
                message: "No valid fields to update",
                data: null,
            });
        }
        const result = await updateUser(userId, filteredData);
        if (!result.success) {
            return res.status(404).json({
                message: result.message,
                data: null,
            });
        }
        res.status(200).json({
            message: "Profile updated successfully",
            data: formatMongoData(result.data),
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await deleteUserService(id);
        if (!response || !response.success) {
            res.status(404).json({
                message: "No such user found!",
                data: null,
            });
        }
        else {
            res.status(200).json({
                message: response.message,
                data: null,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
export const registerUser = async (req, res, next) => {
    try {
        const { password, ...otherData } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userData = {
            ...otherData,
            password: hashedPassword,
        };
        const response = await register(userData);
        if (!response.success) {
            return res.status(400).json({
                message: response.message,
                data: null,
            });
        }
        const token = generateAccessToken({
            id: response.data.id,
            email: req.body.email,
            fullName: req.body.fullName,
        }, "6h");
        const verificationLink = `${config.SERVER_URL}/auth/verify-email?token=${token}`;
        sendVerificationEmail(req.body.email, req.body.fullName, verificationLink);
        console.log("email", req.body.email);
        console.log("fullName", req.body.fullName);
        console.log("verificationLink", verificationLink);
        res.status(201).json({
            message: "User registered successfully | Verify your email",
            data: formatMongoData(response.data),
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Internal server error",
            data: null,
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        const credentials = {
            email: req.body.email,
            password: req.body.password,
        };
        const response = await login(credentials);
        res.cookie("refreshToken", response.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/auth/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "User successfully login",
            token: response.accessToken,
        });
    }
    catch (error) {
        let message = "internal server error";
        let statusCode = 500;
        if (error && typeof error === "object" && "message" in error) {
            message = error.message;
            if ("statusCode" in error) {
                statusCode = error.statusCode;
            }
        }
        res.json({
            message,
            statusCode,
        });
    }
};
export const verifyUserEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        const response = await verifyEmail(token);
        res.redirect(`${config.CLIENT_URL}/auth/email-verified?message=${response?.message}`);
    }
    catch (error) {
        next(error);
    }
};
export const resendVerificationEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                data: null,
            });
        }
        const users = await getByEmail(email);
        if (!users || users.length === 0) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        const user = users[0];
        if (user.isVerified) {
            return res.status(400).json({
                message: "Email is already verified",
                data: null,
            });
        }
        const token = generateAccessToken({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        });
        const verificationLink = `${config.SERVER_URL}/auth/verify-email?token=${token}`;
        await sendVerificationEmail(user.email, user.fullName, verificationLink);
        res.status(200).json({
            message: "Verification email sent successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
export const unlockAccount = async (req, res, next) => {
    try {
        const { token } = req.query;
        const response = await unlockAcc(token);
        res.redirect(`${config.CLIENT_URL}/auth/login?message=${response.message}`);
    }
    catch (error) {
        next(error);
    }
};
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        await forgotPasswordService(email);
        res.status(200).json({
            message: "reset password email was sent!",
        });
    }
    catch (error) {
        if (error && typeof error === "object" && "message" in error) {
            next(error);
        }
        else {
            next(new Error("Internal server error"));
        }
    }
};
export const resetPassword = async (req, res, next) => {
    try {
        const { newPassword, email } = req.body;
        await resetPass(newPassword, email);
        res.status(200).json({
            message: "password reset successfully!",
        });
    }
    catch (error) {
        next(error);
    }
};
export const changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        await changeUserPassword(userId, currentPassword, newPassword);
        res.status(200).json({
            message: "Password changed successfully!",
        });
    }
    catch (error) {
        next(error);
    }
};
export const sendFriendRequest = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { targetUserId } = req.body;
        const currentUser = await UserModel.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        const result = await currentUser.sendFriendRequest(targetUserId);
        res.status(200).json({
            message: result.message,
            data: null,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
            data: null,
        });
    }
};
export const acceptFriendRequest = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { fromUserId } = req.body;
        const currentUser = await UserModel.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        const result = await currentUser.acceptFriendRequest(fromUserId);
        res.status(200).json({
            message: result.message,
            data: null,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
            data: null,
        });
    }
};
export const rejectFriendRequest = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { fromUserId } = req.body;
        const currentUser = await UserModel.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        const result = await currentUser.rejectFriendRequest(fromUserId);
        res.status(200).json({
            message: result.message,
            data: null,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
            data: null,
        });
    }
};
export const removeFriend = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { friendId } = req.params;
        const currentUser = await UserModel.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        const result = await currentUser.removeFriend(friendId);
        res.status(200).json({
            message: result.message,
            data: null,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
            data: null,
        });
    }
};
export const getUserFriends = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId)
            .populate({
            path: "friends",
            select: "fullName username profileImage isVerified",
        })
            .populate([
            {
                path: "friendRequestsReceived.from",
                select: "fullName username profileImage isVerified",
            },
            {
                path: "friendRequestsSent.to",
                select: "fullName username profileImage isVerified",
            },
        ]);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        res.status(200).json({
            message: "Friends data retrieved successfully",
            data: {
                friends: formatMongoData(user.friends),
                friendRequestsReceived: formatMongoData(user.friendRequestsReceived),
                friendRequestsSent: formatMongoData(user.friendRequestsSent),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const searchUsers = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { query } = req.query;
        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                message: "Search query must be at least 2 characters",
                data: [],
            });
        }
        const currentUser = await UserModel.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        const users = await UserModel.find({
            _id: { $ne: userId },
            $or: [
                { fullName: { $regex: query, $options: "i" } },
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
            ],
        })
            .select("fullName username profileImage isVerified profileVisibility")
            .limit(20);
        const searchResults = users.map((user) => ({
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            profileImage: user.profileImage,
            isVerified: user.isVerified,
            profileVisibility: user.profileVisibility,
            // Check relationship status
            isFriend: currentUser.friends.includes(user._id),
            hasRequestPending: currentUser.friendRequestsSent.some((req) => req.to.toString() === user._id.toString()),
            hasReceivedRequest: currentUser.friendRequestsReceived.some((req) => req.from.toString() === user._id.toString()),
        }));
        res.status(200).json({
            message: "Search results retrieved successfully",
            data: searchResults,
        });
    }
    catch (error) {
        next(error);
    }
};
