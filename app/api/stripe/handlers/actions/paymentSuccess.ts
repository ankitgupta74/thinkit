import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { inngest } from "@/inngest/client";

export async function processSuccessfulPayment(
  session: Stripe.Checkout.Session,
) {
  // Stripe Checkout Session contains the order id stored in metadata.
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error("Stripe Checkout Session is missing orderId metadata");

    return;
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
    console.log("No pending card order found for Stripe session:", session.id);

    return;
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
}
