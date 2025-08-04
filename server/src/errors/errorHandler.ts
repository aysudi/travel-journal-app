import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    message: err.message || "Internal server error",
  });
};
