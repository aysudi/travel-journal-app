import express from "express";
import {
  deleteUser,
  getUserByEmail,
  getUsers,
  loginUser,
  registerUser,
  verifyUserEmail,
  resendVerificationEmail,
  unlockAccount,
  forgotPassword,
  resetPassword,
  getUserProfile,
} from "../controllers/userController.js";
import userValidate from "../middlewares/userValidate.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/profile", authenticateToken, getUserProfile);
userRouter.post("/register", userValidate, registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/resend-verification", resendVerificationEmail);
userRouter.get("/unlock-account", unlockAccount);
userRouter.get("/verify-email", verifyUserEmail);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/:email", getUserByEmail);
userRouter.delete("/:id", deleteUser);

export default userRouter;
