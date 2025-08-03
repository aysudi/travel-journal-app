import { Request, Response, NextFunction } from "express";
import {
  getAll,
  getByEmail,
  deleteUser as deleteUserService,
  register,
  login,
  verifyEmail,
} from "../services/userService.js";
import bcrypt from "bcrypt";
import formatMongoData from "../utils/formatMongoData.js";
import { generateAccessToken } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/sendMail.js";
import config from "../config/config.js";

export const getUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAll();

    res.status(200).json({
      message: "Users retrieved seccessfully!",
      data: formatMongoData(users),
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const user = await getByEmail(email);
    if (!user) {
      res.status(404).json({
        message: "no such user with given email",
        data: null,
      });
    } else {
      res.status(200).json({
        message: "user retrieved successfully!",
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const response = await deleteUserService(id);

    if (!response || !response.success) {
      res.status(404).json({
        message: "No such user found!",
        data: null,
      });
    } else {
      res.status(200).json({
        message: response.message,
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, ...otherData } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = {
      ...otherData,
      password: hashedPassword,
    };

    const response: any = await register(userData);

    if (!response.success) {
      throw new Error(response.message);
    }

    const token = generateAccessToken(
      {
        id: response.data.id,
        email: req.body.email,
        fullName: req.body.fullName,
      },
      "6h"
    );

    const verificationLink = `${config.SERVER_URL}/auth/verify-email?token=${token}`;
    sendVerificationEmail(req.body.email, req.body.fullName, verificationLink);

    res.status(201).json({
      message: "User registered successfully | Verify your email",
      data: formatMongoData(response.data),
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      next(error);
    } else {
      next(new Error("Internal server error"));
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
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
  } catch (error: unknown) {
    let message = "internal server error";
    let statusCode = 500;
    if (error && typeof error === "object" && "message" in error) {
      message = (error as any).message;
      if ("statusCode" in error) {
        statusCode = (error as any).statusCode;
      }
    }
    res.json({
      message,
      statusCode,
    });
  }
};

export const verifyUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("hello");
  try {
    const { token } = req.query;

    console.log("Verification token:", token);

    const response = await verifyEmail(token);

    console.log("response: ", response);

    res.redirect(
      `${config.CLIENT_URL}/auth/email-verified?message=${response?.message}`
    );
  } catch (error) {
    next(error);
  }
};
