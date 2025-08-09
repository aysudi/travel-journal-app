import { NextFunction, Response, Request } from "express";
import { getAll, post } from "../services/commentService";
import formatMongoData from "../utils/formatMongoData";

export const getAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = await getAll();

    res.status(200).json({
      message: "Comments fetched successfully",
      data: formatMongoData(comments),
    });
  } catch (error) {
    next(error);
  }
};

export const postComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commentData = {
      ...req.body,
    };

    const newComment = await post(commentData);
    res.status(201).json({
      message: "created new comment",
      data: formatMongoData(newComment),
    });
  } catch (error) {
    next(error);
  }
};
