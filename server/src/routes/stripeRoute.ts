import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripeRouter = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-07-30.basil",
});

stripeRouter.post("/create-checkout-session", async (req, res) => {
  try {
    const {
      lineItems,
      mode = "subscription",
      successUrl,
      cancelUrl,
      customer,
      metadata,
      customText,
      subscriptionData,
    } = req.body;

    // Create proper pricing for VoyageVault Premium
    let priceId;
    const subscriptionType = metadata?.subscriptionType || "monthly";

    if (subscriptionType === "monthly") {
      // Create monthly price if it doesn't exist
      try {
        const monthlyPrice = await stripe.prices.create({
          unit_amount: 999, // $9.99 in cents
          currency: "usd",
          recurring: { interval: "month" },
          product_data: {
            name: "VoyageVault Premium Monthly",
          },
        });
        priceId = monthlyPrice.id;
      } catch (error) {
        // If price already exists, use the existing one
        priceId =
          process.env.STRIPE_MONTHLY_PRICE_ID ||
          "price_1RyVhAQpLe6H2e6mYlqnGuYJ";
      }
    } else {
      // Create yearly price if it doesn't exist
      try {
        const yearlyPrice = await stripe.prices.create({
          unit_amount: 9999, // $99.99 in cents
          currency: "usd",
          recurring: { interval: "year" },
          product_data: {
            name: "VoyageVault Premium Yearly",
          },
        });
        priceId = yearlyPrice.id;
      } catch (error) {
        // If price already exists, use the existing one
        priceId =
          process.env.STRIPE_YEARLY_PRICE_ID ||
          "price_1RyVhAQpLe6H2e6mYlqnGuYJ";
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      payment_method_types: ["card"],
      phone_number_collection: {
        enabled: false,
      },
      custom_text: {
        submit: {
          message:
            "Welcome to VoyageVault Premium! Start your premium journey today.",
        },
      },
      locale: "auto",
    };

    if (customer) sessionParams.customer = customer;
    if (metadata) sessionParams.metadata = metadata;
    if (customText) sessionParams.custom_text = customText;
    if (subscriptionData) sessionParams.subscription_data = subscriptionData;

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout session error:", err);
    return res.status(400).json({ error: err.message });
  }
});

stripeRouter.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd", customer, metadata } = req.body;

    const pi = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        customer,
        metadata,
        automatic_payment_methods: { enabled: true },
      },
      {
        idempotencyKey: (req.headers["idempotency-key"] as string) || undefined,
      }
    );

    return res.json({ clientSecret: pi.client_secret });
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

export default stripeRouter;
