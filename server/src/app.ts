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
app.use(
  cors({
    origin: [
      config.CLIENT_URL || "https://travel-journal-app-78it.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-07-30.basil",
});

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle events you care about:
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Set user as premium after successful checkout
        const userId = session.metadata?.userId;
        const subscriptionType =
          session.metadata?.subscriptionType || "monthly";

        if (userId) {
          (async () => {
            try {
              // Calculate expiry date based on subscription type
              const now = new Date();
              let expiryDate: Date;

              if (subscriptionType === "yearly") {
                expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
              } else {
                expiryDate = new Date(now.setMonth(now.getMonth() + 1));
              }

              await UserModel.findByIdAndUpdate(userId, {
                premium: true,
                premiumExpiresAt: expiryDate,
                stripeCustomerId: session.customer as string,
                subscriptionId: session.subscription as string,
              });
            } catch (err) {
              console.error("Failed to update user premium status:", err);
            }
          })();
        } else {
          console.warn("No userId found in Stripe session metadata.");
        }
        break;
      }
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.status === "active") {
          // Ensure user stays premium
          const customerId = subscription.customer as string;
          (async () => {
            try {
              await UserModel.findOneAndUpdate(
                { stripeCustomerId: customerId },
                { premium: true },
              );
            } catch (err) {
              console.error("Failed to update user subscription status:", err);
            }
          })();
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        // Remove premium status when subscription is cancelled
        const customerId = subscription.customer as string;
        (async () => {
          try {
            await UserModel.findOneAndUpdate(
              { stripeCustomerId: customerId },
              { premium: false, subscriptionId: null },
            );
          } catch (err) {
            console.error(
              "Failed to update user subscription cancellation:",
              err,
            );
          }
        })();
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        // Recurring payment succeeded
        const customerId = invoice.customer as string;
        (async () => {
          try {
            await UserModel.findOneAndUpdate(
              { stripeCustomerId: customerId },
              { premium: true },
            );
          } catch (err) {
            console.error("Failed to update user payment status:", err);
          }
        })();
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        break;
      }
      default:
        break;
    }
    res.json({ received: true });
  },
);

app.get("/", (_, res) => {
  res.send("Server is up and running!");
});

export default app;
