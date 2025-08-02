import User from "../models/User.js";
import bcrypt from "bcrypt";
// import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
// import config from "../config/index.js";
// import { sendUnlockAccountEmail } from "../utils/email.js";
// import { verifyAccessToken } from "../utils/jwt.js";
export const getAll = async () => {
    return await User.find().select("-password");
};
export const getByEmail = async (email) => await User.find({ email: email }).select("-password");
export const deleteUser = async (id) => {
    try {
        const deletedUser = await User.findByIdAndDelete(id);
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
        const user = await User.findById(id);
        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
        }
        await user.save();
        return {
            success: true,
            data: user,
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
        const dublicateUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (dublicateUser) {
            return {
                success: false,
                message: "Username or email already exist",
            };
        }
        return {
            success: true,
            data: await User.create(payload),
        };
    }
    catch (error) {
        let message = "Internal server error";
        if (error && typeof error === "object" && "message" in error) {
            message = error.message;
        }
        return message;
    }
};
export const login = async (credentials) => {
    const { email, password } = credentials;
    const user = await User.findOne({ email });
    if (!user)
        throw new Error("Invalid credentials");
    if (!user.emailVerified)
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
    //   if (!isPasswordCorrect) {
    //     user.loginAttempts = (user.loginAttempts || 0) + 1;
    //     if (user.loginAttempts >= MAX_ATTEMPTS) {
    //       user.lockUntil = new Date(Date.now() + LOCK_TIME);
    //       await user.save();
    //       const token = generateAccessToken(
    //         {
    //           id: user.id,
    //           email: user.email,
    //           fullName: user.profile.displayName,
    //         },
    //         "6h"
    //       );
    //       const unlockAccountLink = `${config.SERVER_URL}/auth/unlock-account?token=${token}`;
    //       sendUnlockAccountEmail(
    //         user.email,
    //         user.profile.displayName,
    //         user.lockUntil,
    //         unlockAccountLink
    //       );
    //       throw new Error(
    //         "Too many login attempts. Account locked for 10 minutes. Check your email"
    //       );
    //     }
    //     await user.save();
    //     throw new Error("Invalid credentials");
    //   }
    user.loginAttempts = 0;
    user.isBanned = false;
    user.lastLogin = new Date();
    await user.save();
    //   const accessToken = generateAccessToken({
    //     email: user.email,
    //     id: user.id,
    //     fullName: user.profile.displayName,
    //   });
    //   const refreshToken = generateRefreshToken({
    //     email: user.email,
    //     id: user.id,
    //     fullName: user.profile.displayName,
    //   });
    return {
        message: "User login successfully!",
        // accessToken: accessToken,
        // refreshToken: refreshToken,
    };
};
// export const verifyEmail = async (token: any) => {
//   const isValidToken: any = verifyAccessToken(token);
//   if (isValidToken) {
//     const { id } = isValidToken;
//     const user = await User.findById(id);
//     if (user) {
//       if (user.emailVerified) {
//         return {
//           success: false,
//           message: "email already has been verified",
//         };
//       } else {
//         user.emailVerified = true;
//         await user.save();
//         return {
//           success: true,
//           message: "email has been verified successfully!",
//         };
//       }
//     }
//   } else {
//     throw new Error("invalid or expired token!");
//   }
// };
