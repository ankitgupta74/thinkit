import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { markCardPaymentFailed } from "./actions/paymentFailure";
import { processSuccessfulPayment } from "./actions/paymentSuccess";

// Stripe needs the raw request body to verify that the webhook really came from Stripe.
// Server-side Stripe client used to verify webhook events and read Stripe event data.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Reusable failure path for Checkout sessions that expire or report a failed payment.
export async function handleStripeWebhook(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature)
      return NextResponse.json(
        { success: false, message: "Missing signature" },
        { status: 400 },
      );

    const body = await request.text();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret)
      throw new Error("Missing STRIPE_WEBHOOK_SECRET in .env.local");

    // Verify event
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );
    const session = event.data.object as Stripe.Checkout.Session;

    // Route: Expired
    if (event.type === "checkout.session.expired") {
      await markCardPaymentFailed(
        session,
        "Cancelled",
        "Stripe Checkout session expired before payment was completed",
      );
      return NextResponse.json({ received: true });
    }

    // Route: Failed
    if (event.type === "checkout.session.async_payment_failed") {
      await markCardPaymentFailed(
        session,
        "Payment Failed",
        "Stripe reported that the card payment failed",
      );
      return NextResponse.json({ received: true });
    }

    // Route: Success
    if (event.type === "checkout.session.completed") {
      await processSuccessfulPayment(session);
      return NextResponse.json({ received: true });
    }

    // Route: Ignored events
    console.log("Ignoring Stripe event:", event.type);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { success: false, message: "Stripe webhook could not be processed" },
      { status: 400 },
    );
  }
}
