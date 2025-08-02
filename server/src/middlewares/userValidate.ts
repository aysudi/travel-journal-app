import { NextFunction, Request, Response } from "express";
import { userRegistrationSchema } from "../validations/user.validation.js";

const userValidate = (req: Request, res: Response, next: NextFunction) => {
  console.log("Validation middleware - Request body:", req.body);

  const { error } = userRegistrationSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    console.log("Validation errors:", errorMessage);
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  } else {
    console.log("Validation passed successfully");
    next();
  }
};

export default userValidate;
