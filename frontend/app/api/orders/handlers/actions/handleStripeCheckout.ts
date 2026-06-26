import Stripe from "stripe";

// Server-only Stripe client used to create Checkout Sessions.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Redirect card customers to Stripe-hosted Checkout.
// Card path:
export async function handleStripeCheckout(
  order: {
    _id: string | { toString: () => string };
    stripeCheckoutSessionId?: string;
    save: () => Promise<unknown>;
  },
  total: number,
  origin: string,
) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    // Grocery orders should not remain pending for an entire day.
    // Close unfinished Checkout sessions after 30 minutes.
    // The webhook changes the pending order to Cancelled when this happens.
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,

    // Return customer to their order after successful Stripe payment.
    // This redirect improves customer experience only.
    // The Stripe webhook, not this page, marks the payment as successful.
    success_url: `${origin}/orders/${order._id}?payment=success`,

    // Return customer to checkout without marking the order paid.
    // Customer can return to checkout without treating the order as paid.
    cancel_url: `${origin}/checkout?payment=cancelled`,

    // Stripe metadata lets the webhook find the exact MongoDB order.
    metadata: {
      orderId: order._id.toString(),
    },

    line_items: [
      {
        price_data: {
          currency: "inr",

          product_data: {
            name: "ThinkIt Grocery Order",
          },

          // Stripe uses paise, so ₹200.20 becomes 20020.
          unit_amount: Math.round(total * 100),
        },

        quantity: 1,
      },
    ],
  });

  // Store the Stripe session ID for audit, debugging, and payment lookup.
  order.stripeCheckoutSessionId = session.id;
  await order.save();

  // Return the URL so the main handler can send it to the frontend
  return session.url;
}
