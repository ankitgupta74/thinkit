import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getDeliveryPartner } from "@/lib/deliveryAuth";

// Allowed delivery flow:
// Assigned 
// → Packed 
// → Out for Delivery 
// → Delivered

export async function handleUpdateStatus(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Database connection is required before checking or updating orders.
    await connectDB();

    // Identify the currently logged-in delivery partner.
    const partner = await getDeliveryPartner();

    // Only authenticated delivery partners can update delivery status.
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

    // Read the requested delivery status from the request body.
    const { status } = await request.json();

    // Rider can only move an order through active delivery stages.
    const allowedStatusUpdates: Record<string, string[]> = {
      Assigned: ["Packed"],
      Packed: ["Out for Delivery"],
    };

    // Read the order id from the URL.
    const { id } = await params;

    // Find only an order assigned to this logged-in rider.
    const order = await Order.findOne({
      _id: id,
      deliveryPartner: partner._id,
    });

    // Prevent riders from changing another rider's order.
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Delivery not found",
        },
        {
          status: 404,
        },
      );
    }

    // Reject invalid or unsupported delivery status updates.
    if (!allowedStatusUpdates[order.status]?.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid delivery status update",
        },
        {
          status: 400,
        },
      );
    }

    // Delivered and cancelled orders must never be changed again.
    if (order.status === "Delivered" || order.status === "Cancelled") {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot update a ${order.status.toLowerCase()} order`,
        },
        {
          status: 400,
        },
      );
    }

    // Keep previous tracking events before adding the next delivery stage.
    const history = Array.isArray(order.statusHistory)
      ? [...order.statusHistory]
      : [];

    // Add a new event for the customer order timeline.
    history.push({
      status,
      note: `Status updated to ${status}`,
      timestamp: new Date(),
    });

    // Save the latest status and complete timeline.
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status,
        statusHistory: history,
      },
      {
        returnDocument: "after",
      },
    );

    // Return the updated delivery order.
    return NextResponse.json({
      success: true,
      message: "Delivery status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update delivery status",
      },
      {
        status: 500,
      },
    );
  }
}
