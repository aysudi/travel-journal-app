import express from "express";
import {
  deleteUser,
  getUserByEmail,
  getUsers,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:email", getUserByEmail);
userRouter.delete("/:id", deleteUser);

export default userRouter;
