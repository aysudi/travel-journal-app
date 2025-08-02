import mongoose from "mongoose";
import userSchema from "../schemas/userSchema.js";
// Create the model
const User = mongoose.model("User", userSchema);
// Create indexes after model creation (when database is connected)
const createUserIndexes = async () => {
    try {
        await User.createIndexes();
        console.log("✅ User indexes created successfully");
    }
    catch (error) {
        console.error("❌ Failed to create User indexes:", error);
    }
};
// Export both the model and index creation function
export { createUserIndexes };
export default User;
