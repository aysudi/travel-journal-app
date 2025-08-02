import { getAll, getByEmail, deleteUser as deleteUserService, register, login, } from "../services/userService";
import bcrypt from "bcrypt";
import formatMongoData from "../utils/formatMongoData";
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
        const { password, profile, hobbies, ...otherData } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const profileData = {
            ...profile,
        };
        // if (req.file) {
        //   const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        //     folder: "user_profiles",
        //   });
        //   profileData.avatar = uploadedImage.secure_url;
        //   profileData.public_id = uploadedImage.public_id;
        // }
        const userData = {
            ...otherData,
            password: hashedPassword,
        };
        const response = await register(userData);
        if (!response.success) {
            throw new Error(response.message);
        }
        // const token = generateAccessToken(
        //   {
        //     id: response.data._id,
        //     email: req.body.email,
        //     fullName: `${req.body.profile.firstName} ${req.body.profile.lastName}`,
        //   },
        //   "6h"
        // );
        // const verificationLink = `${process.env.SERVER_URL}/auth/verify-email?token=${token}`;
        // sendVerificationEmail(
        //   req.body.email,
        //   req.body.profile.firstName + " " + req.body.profile.lastName,
        //   verificationLink
        // );
        res.status(201).json({
            message: "User registered successfully | Verify your email",
            data: response.data,
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
export const loginUser = async (req, res) => {
    try {
        const credentials = {
            email: req.body.email,
            password: req.body.password,
        };
        const response = await login(credentials);
        // res.cookie("refreshToken", response.refreshToken, {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: "strict",
        //   path: "/auth/refresh",
        //   maxAge: 7 * 24 * 60 * 60 * 1000,
        // });
        res.status(200).json({
            message: "User successfully login",
            //   token: response.accessToken,
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
