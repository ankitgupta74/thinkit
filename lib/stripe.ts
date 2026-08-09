import Stripe from "stripe";

// Stripe is used only inside server-side API routes.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY in .env.local");
}

export const stripe = new Stripe(stripeSecretKey);
