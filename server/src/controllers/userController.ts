import { Request, Response, NextFunction } from "express";
import {
  getAll,
  getByEmail,
  deleteUser as deleteUserService,
  register,
  login,
  verifyEmail,
  unlockAcc,
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
      return res.status(400).json({
        message: response.message,
        data: null,
      });
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
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error",
      data: null,
    });
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
  console.log("req.query: ", req.query);
  console.log("req.params: ", req.params);
  try {
    const { token } = req.query;

    const response = await verifyEmail(token);

    res.redirect(
      `${config.CLIENT_URL}/auth/email-verified?message=${response?.message}`
    );
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    // Generate new verification token
    const token = generateAccessToken({ email: user.email });
    const verificationLink = `${config.SERVER_URL}/auth/verify-email?token=${token}`;

    await sendVerificationEmail(user.email, user.fullName, verificationLink);

    res.status(200).json({
      message: "Verification email sent successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const unlockAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;

    const response = await unlockAcc(token);

    res.redirect(`${config.CLIENT_URL}/auth/login?message=${response.message}`);
  } catch (error) {
    next(error);
  }
};
