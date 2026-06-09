import { inngest } from "../client";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import DeliveryPartner from "@/models/DeliveryPartner";

// Business Goal:
// Bring customers back by regularly promoting products through email campaigns.

// Workflow Flow:
// Order Placed → Wait → Check Order → Find Available Rider → Assign Rider → Generate OTP

// Automatically assigns an available delivery rider after a new order has been placed.
export const autoAssignRider = inngest.createFunction(
  {
    id: "auto-assign-rider",
    name: "Auto Assign Delivery Rider",
    // Start this workflow whenever a customer places an order.
    triggers: [
      {
        // Fired immediately after successful order creation.
        event: "order/placed",
      },
    ],
  },
  async ({ event, step }) => {
    console.log("AUTO ASSIGN RIDER TRIGGERED");

    // Get the order that triggered this workflow.
    const { orderId } = event.data;
    console.log("Order ID:", orderId);

    // Give the system a short delay before assigning a rider.
    // Useful if other order updates happen immediately after placement.
    console.log("Waiting 5 minutes before rider assignment...");
    await step.sleep("wait-5-sec", "5s");

    console.log("5 minute wait completed");

    // Perform the rider assignment logic inside a tracked workflow step.
    const result = await step.run("check-order-status", async () => {
      // Fetch the latest order information from the database.
      await connectDB();

      // Find the order that needs rider assignment.
      const order = await Order.findById(orderId);
      if (!order) {
        return {
          skipped: true,
          reason: "Order not found",
        };
      }

      console.log("ORDER FOUND");
      console.log(order._id);
      console.log(order.status);

      // Skip if a rider has already been assigned.
      if (order.deliveryPartner) {
        return {
          skipped: true,
          reason: "Already assigned",
        };
      }

      // No delivery is needed for cancelled/delivered orders.
      if (order.status === "Cancelled" || order.status === "Delivered") {
        return {
          skipped: true,
          reason: `Order ${order.status}`,
        };
      }

      // Find riders who are currently handling active deliveries.
      const busyOrders = await Order.find(
        {
          status: {
            $in: ["Assigned", "Packed", "Out for Delivery"],
          },

          deliveryPartner: {
            $ne: null,
          },
        },
        {
          deliveryPartner: 1,
        },
      );

      // Build a list of riders who should not receive new orders.
      const busyRiderIds = busyOrders.map((order) => order.deliveryPartner);
      console.log("Busy Riders:", busyRiderIds.length);

      // Pick an active rider who is currently free.
      const availableRider = await DeliveryPartner.findOne({
        isActive: true,

        _id: {
          $nin: busyRiderIds,
        },
      });

      // Stop if no rider is available right now.
      if (!availableRider) {
        return {
          skipped: true,
          reason: "No riders available",
        };
      }

      console.log("AVAILABLE RIDER:");
      console.log(availableRider.name);

      // Create a delivery verification code for order handover.
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      console.log("Generated OTP:", otp);

      // Keep a record of important order status changes.
      const history = Array.isArray(order.statusHistory)
        ? [...order.statusHistory]
        : [];

      // Add the rider assignment event to the order timeline.
      history.push({
        status: "Assigned",
        note: `Auto-assigned to ${availableRider.name}`,
        timestamp: new Date(),
      });

      // Save rider details and move the order into Assigned status.
      await Order.findByIdAndUpdate(orderId, {
        deliveryPartner: availableRider._id,

        deliveryOtp: otp,

        status: "Assigned",

        statusHistory: history,
      });

      console.log("RIDER ASSIGNED");
      console.log("Rider:", availableRider.name);
      console.log("OTP:", otp);

      // Return assignment details for workflow logs and debugging.
      return {
        assigned: true,
        riderId: availableRider._id,
        riderName: availableRider.name,
        orderId,
      };
    });

    console.log(result);

    return result;
  },
);
