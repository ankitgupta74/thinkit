import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function markCardPaymentFailed(
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
