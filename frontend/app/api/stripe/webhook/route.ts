import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { inngest } from "@/inngest/client";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import "@/models/User";
import "@/models/DeliveryPartner";

// Stripe needs the raw request body to verify that the webhook really came from Stripe.
// Server-side Stripe client used to verify webhook events and read Stripe event data.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Updates a pending card order when Stripe reports that Checkout did not finish.
// Reusable failure path for Checkout sessions that expire or report a failed payment.
async function markCardPaymentFailed(
  session: Stripe.Checkout.Session,
  status: "Payment Failed" | "Cancelled",
  note: string,
) {
  // Metadata connects this Stripe session back to the Thinkit order.
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error(
      "Stripe Checkout Session is missing orderId metadata:",
      session.id,
    );

    return;
  }

  await connectDB();

  // Only change an order that is still waiting for Stripe confirmation.
  // This keeps duplicate webhook events safe.
  const order = await Order.findOne({
    _id: orderId,
    paymentMethod: "card",
    isPaid: false,
    status: "Payment Pending",
  });

  if (!order) {
    console.log(
      "No pending card order found for failed Stripe session:",
      session.id,
    );

    return;
  }

  // Keep the order for payment history and customer visibility.
  // Do not trigger stock reduction or rider assignment.
  order.status = status;

  order.statusHistory.push({
    status,
    note,
    timestamp: new Date(),
  });

  await order.save();

  console.log("CARD PAYMENT NOT COMPLETED");
  console.log("Order ID:", order._id.toString());
  console.log("Stripe Checkout Session:", session.id);
  console.log("New Status:", status);
}

export async function POST(request: NextRequest) {
  try {
    // Stripe sends this signature with every webhook request.
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Stripe signature",
        },
        {
          status: 400,
        },
      );
    }

    // Do not use request.json() here.
    // Stripe signature verification requires the untouched raw request body.
    const body = await request.text();

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET in .env.local");
    }

    // Verify that Stripe created this event.
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );

    // Customer did not finish Checkout before Stripe's payment window ended.
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;

      await markCardPaymentFailed(
        session,
        "Cancelled",
        "Stripe Checkout session expired before payment was completed",
      );

      return NextResponse.json({
        received: true,
      });
    }

    // Stripe finished processing later and reported that the payment failed.
    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;

      await markCardPaymentFailed(
        session,
        "Payment Failed",
        "Stripe reported that the card payment failed",
      );

      return NextResponse.json({
        received: true,
      });
    }

    // Continue only when Stripe confirms that Checkout completed successfully.
    // Ignore event types this endpoint does not process.
    if (event.type !== "checkout.session.completed") {
      console.log("Ignoring Stripe event:", event.type);

      return NextResponse.json({
        received: true,
      });
    }

    // From here onward, Stripe has confirmed a successful Checkout payment.
    const session = event.data.object as Stripe.Checkout.Session;

    // Stripe Checkout Session contains the order id stored in metadata.
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("Stripe Checkout Session is missing orderId metadata");

      return NextResponse.json(
        {
          success: false,
          message: "Missing order id in Stripe metadata",
        },
        {
          status: 400,
        },
      );
    }

    // Connect before updating the paid order.
    await connectDB();

    // Only update a card order that is still waiting for payment.
    // This prevents duplicate Stripe webhook deliveries from triggering the flow twice.
    const order = await Order.findOne({
      _id: orderId,
      paymentMethod: "card",
      isPaid: false,
      status: "Payment Pending",
    });

    if (!order) {
      console.log(
        "No pending card order found for Stripe session:",
        session.id,
      );

      return NextResponse.json({
        received: true,
      });
    }

    // Checkout Session contains the Payment Intent after successful payment.
    // Save Stripe's payment reference so this order can be matched during support or refunds.
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || "";

    // Mark payment as completed and move the order into the normal order workflow.
    order.isPaid = true;
    order.status = "Placed";
    order.stripePaymentIntentId = paymentIntentId;

    // Keep payment confirmation visible in the order timeline.
    order.statusHistory.push({
      status: "Placed",
      note: "Card payment confirmed by Stripe",
      timestamp: new Date(),
    });

    await order.save();

    // Payment is confirmed, so inventory can now be reserved permanently.
    // Reduce stock only after Stripe confirms payment.
    // This prevents abandoned Checkout sessions from reducing inventory.
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
        },
      });

      // Check whether this product reached low-stock level after the purchase.
      // Let the background workflow decide whether this product now needs a low-stock alert.
      await inngest.send({
        name: "inventory/stock.updated",
        data: {
          productId: item.product.toString(),
        },
      });
    }

    // Start the same delivery workflow used by successful COD orders.
    // Start rider assignment only after this paid order enters the normal delivery flow.
    await inngest.send({
      name: "order/placed",
      data: {
        orderId: order._id.toString(),
      },
    });

    console.log("CARD PAYMENT CONFIRMED");
    console.log("Order ID:", order._id.toString());
    console.log("Stripe Payment Intent:", paymentIntentId);

    // Stripe requires a successful HTTP response after processing the event.
    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    // Return 400 so Stripe knows this webhook was not accepted.
    console.error("Stripe webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Stripe webhook could not be processed",
      },
      {
        status: 400,
      },
    );
  }
}
