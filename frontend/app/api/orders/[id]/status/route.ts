import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Order from "@/models/Order";

import { getAdminUser } from "@/lib/admin";
import { ORDER_STATUSES } from "@/lib/orderStatus";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Connect before reading or updating order data
    await connectDB();

    // Only admins are allowed to change order status
    const user = await getAdminUser();

    // Block normal customers from accessing this route
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        {
          status: 403,
        },
      );
    }

    // Read the new status and optional admin note
    const { status, note } = await request.json();

    // Status is the minimum information required for an update
    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required",
        },
        {
          status: 400,
        },
      );
    }

    // Read the order id from the URL
    const { id } = await params;

    // Find the order that needs a status update
    const order = await Order.findById(id);

    // Stop if the requested order does not exist
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

    // Only allow statuses that exist in our workflow
    // Prevent invalid or misspelled statuses from entering the system.
    if (!ORDER_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        {
          status: 400,
        },
      );
    }

    // Delivery-related statuses require a rider
    // These stages require an assigned rider.
    const deliveryStatuses = [
      "Packed",
      "Assigned",
      "Out for Delivery",
      "Delivered",
    ];

    if (deliveryStatuses.includes(status) && !order.deliveryPartner) {
      return NextResponse.json(
        {
          success: false,
          message: "Assign a delivery partner before updating delivery status",
        },
        {
          status: 400,
        },
      );
    }

    // Start with existing history so previous updates are not lost
    const history = Array.isArray(order.statusHistory)
      ? [...order.statusHistory]
      : [];
    // Save every status change for tracking and timeline views
    history.push({
      status,
      note: note || `Order ${status.toLowerCase()}`, // Use admin note if provided, otherwise create a simple default message
      timestamp: new Date(),
    });

    // Update current status and save the complete history
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status,
        statusHistory: history, // Store all previous status changes together with the new one
      },
      {
        returnDocument: "after", // Return the updated version after the change
      },
    );

    // Send updated order data back to the frontend
    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order status",
      },
      {
        status: 500,
      },
    );
  }
}
