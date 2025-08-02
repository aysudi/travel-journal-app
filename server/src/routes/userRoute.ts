import express from "express";
import {
  deleteUser,
  getUserByEmail,
  getUsers,
  loginUser,
  registerUser,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:email", getUserByEmail);
userRouter.delete("/:id", deleteUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
