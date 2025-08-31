import passport from "passport";
import "./config/passport.js";
import cors from "cors";
import express from "express";
import config from "./config/config.js";
import Stripe from "stripe";
import UserModel from "./models/User.js";
import "./models/User.js";
import "./models/TravelList.js";
import "./models/JournalEntry.js";
import "./models/Destination.js";
import "./models/Message.js";
import "./models/Notification.js";
import "./models/ListInvitation.js";
import userRouter from "./routes/userRoute.js";
import travelListRouter from "./routes/travelListRoute.js";
import destinationRouter from "./routes/destinationRoute.js";
import journalEntryRouter from "./routes/journalEntryRoute.js";
import messageRouter from "./routes/messageRoute.js";
import googleRouter from "./routes/googleRoute.js";
import githubRouter from "./routes/githubRoute.js";
import commentRouter from "./routes/commentRoute.js";
import listInvitationRouter from "./routes/listInvitationRoutes.js";
import uploadRouter from "./routes/uploadRoute.js";
import chatRouter from "./routes/chatRoute.js";
import stripeRouter from "./routes/stripeRoute.js";
const app = express();
app.use(passport.initialize());
app.use(express.json());
app.use(cors({
    origin: [
        config.CLIENT_URL || "http://localhost:5176",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    credentials: true,
}));
// Using routes
app.use("/auth", googleRouter);
app.use("/auth", githubRouter);
app.use("/auth", userRouter);
app.use("/travel-lists", travelListRouter);
app.use("/destinations", destinationRouter);
app.use("/journal-entries", journalEntryRouter);
app.use("/messages", messageRouter);
app.use("/comments", commentRouter);
app.use("/list-invitations", listInvitationRouter);
app.use("/api", uploadRouter);
app.use("/chats", chatRouter);
app.use("/messages", messageRouter);
app.use("/api/payments", stripeRouter);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
});
app.post("/api/payments/webhook", 
// IMPORTANT: raw body for signature verification:
express.raw({ type: "application/json" }), (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle events you care about:
    switch (event.type) {
        case "payment_intent.succeeded": {
            const pi = event.data.object;
            // TODO: mark order as paid in your DB using pi.id / metadata
            break;
        }
        case "checkout.session.completed": {
            const session = event.data.object;
            // Set user as premium after successful payment
            const userId = session.metadata?.userId;
            if (userId) {
                (async () => {
                    try {
                        await UserModel.findByIdAndUpdate(userId, { premium: true });
                        console.log(`User ${userId} upgraded to premium.`);
                    }
                    catch (err) {
                        console.error("Failed to update user premium status:", err);
                    }
                })();
            }
            else {
                console.warn("No userId found in Stripe session metadata.");
            }
            break;
        }
        // ...add invoice.paid, customer.subscription.* if you use subscriptions
        default:
            // console.log(`Unhandled event: ${event.type}`);
            break;
    }
    res.json({ received: true });
});
app.get("/", (_, res) => {
    res.send("Server is up and running!");
});
export default app;
