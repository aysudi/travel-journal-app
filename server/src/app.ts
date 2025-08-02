import cors from "cors";
import express from "express";
// Importing routes
import userRouter from "./routes/userRoute.js";
import travelListRouter from "./routes/travelListRoute.js";
import destinationRouter from "./routes/destinationRoute.js";
import journalEntryRouter from "./routes/journalEntryRoute.js";
import messageRouter from "./routes/messageRoute.js";

const app = express();

app.use(express.json());
app.use(cors());

// Using routes
app.use("/auth", userRouter);
app.use("/travel-lists", travelListRouter);
app.use("/destinations", destinationRouter);
app.use("/journal-entries", journalEntryRouter);
app.use("/messages", messageRouter);

// Health check route
app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/", (_, res) => {
  res.send("Server is up and running!");
});

export default app;
