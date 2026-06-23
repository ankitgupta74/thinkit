import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/User";
import "@/models/DeliveryPartner";
import { getDeliveryPartner } from "@/lib/deliveryAuth";

// Cancels one assigned delivery and records the rider's reason.
export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    // Identify which rider is making the request.
    const partner = await getDeliveryPartner();

    // Only the logged-in rider can cancel their assigned delivery.
    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // Read the reason so the cancellation is visible in the order timeline.
    const { reason } = await request.json();

    const { id } = await context.params;

    // Fetch only orders assigned to this rider.
    const order = await Order.findOne({
      _id: id,
      deliveryPartner: partner._id,
    }).populate("user", "name email phone");

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    // A finished delivery is final and cannot be cancelled.
    if (order.status === "Delivered") {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot cancel delivered order",
        },
        {
          status: 400,
        },
      );
    }

    // Avoid adding the same cancellation event more than once.
    if (order.status === "Cancelled") {
      return NextResponse.json(
        {
          success: false,
          message: "Order already cancelled",
        },
        {
          status: 400,
        },
      );
    }

    const history = Array.isArray(order.statusHistory)
      ? [...order.statusHistory]
      : [];

    // Add cancellation as a timeline event for customer and admin tracking.
    history.push({
      status: "Cancelled",
      note: reason || "",
      timestamp: new Date(),
    });

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: "Cancelled",
        statusHistory: history,
      },
      {
        returnDocument: "after",
      },
    );

    return NextResponse.json({
      success: true,
      message: "Order cancelled",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to cancel delivery",
      },
      {
        status: 500,
      },
    );
  }
}
