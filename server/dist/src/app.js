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
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), (req, res) => {
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
            console.log("Payment succeeded:", pi.id);
            break;
        }
        case "checkout.session.completed": {
            const session = event.data.object;
            // Set user as premium after successful checkout
            const userId = session.metadata?.userId;
            const subscriptionType = session.metadata?.subscriptionType || "monthly";
            if (userId) {
                (async () => {
                    try {
                        // Calculate expiry date based on subscription type
                        const now = new Date();
                        let expiryDate;
                        if (subscriptionType === "yearly") {
                            expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
                        }
                        else {
                            expiryDate = new Date(now.setMonth(now.getMonth() + 1));
                        }
                        await UserModel.findByIdAndUpdate(userId, {
                            premium: true,
                            premiumExpiresAt: expiryDate,
                            stripeCustomerId: session.customer,
                            subscriptionId: session.subscription,
                        });
                        console.log(`User ${userId} upgraded to premium via checkout session ${session.id}. Expires: ${expiryDate}`);
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
        case "customer.subscription.created": {
            const subscription = event.data.object;
            console.log("Subscription created:", subscription.id);
            break;
        }
        case "customer.subscription.updated": {
            const subscription = event.data.object;
            if (subscription.status === "active") {
                // Ensure user stays premium
                const customerId = subscription.customer;
                (async () => {
                    try {
                        await UserModel.findOneAndUpdate({ stripeCustomerId: customerId }, { premium: true });
                        console.log(`Subscription ${subscription.id} activated for customer ${customerId}.`);
                    }
                    catch (err) {
                        console.error("Failed to update user subscription status:", err);
                    }
                })();
            }
            break;
        }
        case "customer.subscription.deleted": {
            const subscription = event.data.object;
            // Remove premium status when subscription is cancelled
            const customerId = subscription.customer;
            (async () => {
                try {
                    await UserModel.findOneAndUpdate({ stripeCustomerId: customerId }, { premium: false, subscriptionId: null });
                    console.log(`Subscription ${subscription.id} cancelled for customer ${customerId}.`);
                }
                catch (err) {
                    console.error("Failed to update user subscription cancellation:", err);
                }
            })();
            break;
        }
        case "invoice.payment_succeeded": {
            const invoice = event.data.object;
            // Recurring payment succeeded
            const customerId = invoice.customer;
            (async () => {
                try {
                    await UserModel.findOneAndUpdate({ stripeCustomerId: customerId }, { premium: true });
                    console.log(`Invoice payment succeeded for customer ${customerId}.`);
                }
                catch (err) {
                    console.error("Failed to update user payment status:", err);
                }
            })();
            break;
        }
        case "invoice.payment_failed": {
            const invoice = event.data.object;
            console.log(`Invoice payment failed for customer ${invoice.customer}.`);
            // Could optionally send notification to user about failed payment
            break;
        }
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
