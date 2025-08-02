import express from "express";
import {
  deleteUser,
  getUserByEmail,
  getUsers,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import userValidate from "../middlewares/userValidate.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:email", getUserByEmail);
userRouter.delete("/:id", deleteUser);
userRouter.post("/register", userValidate, registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
