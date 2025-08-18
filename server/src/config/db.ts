import mongoose from "mongoose";
import config from "./config.js";

const connectToDB = async () => {
  if (!config.DB_URL) {
    console.log("❌ DB_URL is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(config.DB_URL);
    console.log("🚀 mongodb connected successfully");
  } catch (error) {
    console.log("❌ mongodb connection failed", error);
    process.exit(1);
  }
};

export default connectToDB;
