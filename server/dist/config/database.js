import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
        const connectionString = process.env.DB_URL;
        if (!connectionString) {
            throw new Error("DB_URL is not defined in environment variables");
        }
        // Connect to MongoDB
        await mongoose.connect(connectionString);
        console.log("✅ MongoDB connected successfully");
        // Handle connection events
        mongoose.connection.on("error", (error) => {
            console.error("❌ MongoDB connection error:", error);
        });
        mongoose.connection.on("disconnected", () => {
            console.log("⚠️ MongoDB disconnected");
        });
    }
    catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};
export default connectDB;
