import mongoose from "mongoose";
import userSchema from "../schemas/userSchema.js";
// Add indexes for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ isVerified: 1 });
const User = mongoose.model("User", userSchema);
export default User;
