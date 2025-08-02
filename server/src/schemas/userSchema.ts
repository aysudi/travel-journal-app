import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isVerified: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "TravelList" }],
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ isVerified: 1 });

export default userSchema;
