import mongoose from "mongoose";
import userSchema from "../schemas/userSchema.js";
import { IUserDocument, IUserModel } from "../types/User.js";

const UserModel = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default UserModel;
