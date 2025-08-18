import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export interface AuthenticatedMulterRequest extends AuthenticatedRequest {
  file?: Express.Multer.File;
}
