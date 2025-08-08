import mongoose from "mongoose";
import config from "./config.js";
const connectToDB = (app) => {
    if (!config.DB_URL) {
        console.error("❌ DB_URL is not defined in environment variables");
        process.exit(1);
    }
    if (!config.DB_PASSWORD) {
        console.error("❌ DB_PASSWORD is not defined in environment variables");
        process.exit(1);
    }
    console.log("🔄 Attempting to connect to MongoDB...");
    mongoose
        .connect(config.DB_URL)
        .then(() => {
        console.log("🚀 mongodb connected successfully!");
        app.listen(config.PORT, () => {
            console.log(`server running on port: ${config.PORT}`);
        });
    })
        .catch((err) => {
        console.warn("❌ db connection failed: ", err.message);
        console.error("Full error:", err);
    });
};
export default connectToDB;
