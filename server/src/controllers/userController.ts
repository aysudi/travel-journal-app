import { Request, Response, NextFunction } from "express";
import {
  getAll,
  getByEmail,
  deleteUser as deleteUserService,
} from "../services/userService";
import formatMongoData from "../utils/formatMongoData";

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
