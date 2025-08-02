import mongoose from "mongoose";
import config from "./config";
const connectToDB = (app) => {
    if (!config.DB_URL) {
        console.error("Database URL is not defined in the environment variables.");
        process.exit(1);
    }
    if (!config.DB_PASSWORD) {
        console.error("Database password is not defined in the environment variables.");
        process.exit(1);
    }
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
    });
};
module.exports = connectToDB;
