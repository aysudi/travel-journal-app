import express from "express";
import Stripe from "stripe";

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
      metadata, // <-- extract metadata from req.body
    } = req.body;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer,
      allow_promotion_codes: true,
    };
    if (metadata) sessionParams.metadata = metadata;

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error(err);
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
