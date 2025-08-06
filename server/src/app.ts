import cors from "cors";
import express from "express";
import passport from "passport";

import "./models/User.js";
import "./models/TravelList.js";
import "./models/JournalEntry.js";
import "./models/Destination.js";
import "./models/Message.js";
import "./models/Notification.js";

import userRouter from "./routes/userRoute.js";
import travelListRouter from "./routes/travelListRoute.js";
import destinationRouter from "./routes/destinationRoute.js";
import journalEntryRouter from "./routes/journalEntryRoute.js";
import messageRouter from "./routes/messageRoute.js";
import googleRouter from "./routes/googleRoute.js";
import githubRouter from "./routes/githubRoute.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Using routes
app.use("/auth", googleRouter);
app.use("/auth", githubRouter);
app.use("/auth", userRouter);
app.use("/travel-lists", travelListRouter);
app.use("/destinations", destinationRouter);
app.use("/journal-entries", journalEntryRouter);
app.use("/messages", messageRouter);

app.get("/", (_, res) => {
  res.send("Server is up and running!");
});

export default app;
