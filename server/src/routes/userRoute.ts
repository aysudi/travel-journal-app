import express from "express";
import {
  deleteUser,
  getUserByEmail,
  getUsers,
  loginUser,
  registerUser,
  verifyUserEmail,
} from "../controllers/userController.js";
import userValidate from "../middlewares/userValidate.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/register", userValidate, registerUser);
userRouter.post("/login", loginUser);
// userRouter.get("/unlock-account", sendUnlockAccountEmail);
userRouter.get("/verify-email", verifyUserEmail);
userRouter.get("/:email", getUserByEmail);
userRouter.delete("/:id", deleteUser);

export default userRouter;
