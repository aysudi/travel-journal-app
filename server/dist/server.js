import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
// Start server with database connection
const startServer = async () => {
    try {
        // Connect to database first
        await connectDB();
        // Start the server after successful database connection
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
