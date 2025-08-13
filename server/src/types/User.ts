import { Document, Model, Types } from "mongoose";

export interface IFriendRequest {
  from?: Types.ObjectId;
  to?: Types.ObjectId;
  sentAt: Date;
}

export interface IUserMethods {
  sendFriendRequest(targetUserId: string): Promise<{ message: string }>;
  acceptFriendRequest(fromUserId: string): Promise<{ message: string }>;
  rejectFriendRequest(fromUserId: string): Promise<{ message: string }>;
  removeFriend(friendId: string): Promise<{ message: string }>;
  getAllListsWithRoles(): Promise<any[]>;
}

export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  profileImage: string;
  public_id: string;
  isVerified: boolean;
  isLocked: boolean;
  loginAttempts: number;
  lockUntil?: Date;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  password?: string;
  provider: "local" | "google" | "github";
  providerId?: string;
  profileVisibility: "public" | "private";
  friends: Types.ObjectId[];
  friendRequestsReceived: IFriendRequest[];
  friendRequestsSent: IFriendRequest[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, IUserMethods {}

export interface IUserModel extends Model<IUserDocument> {}
