// Order details and order management endpoint.

// Supports:
// GET    → View order details
// PATCH  → Cancel order
// DELETE → Permanently remove order (Admin)

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

import Order from "@/models/Order";

import "@/models/User";
import "@/models/Product";
import "@/models/DeliveryPartner";
import { getAdminUser } from "@/lib/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Connect before reading order data
    await connectDB();

    // Read the order id from the URL
    const { id } = await params;

    // Order details should only be visible to logged-in users
    const user = await getAuthUser();

    if (!user) {
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

    // Fetch only if this order belongs to the current user
    const order = await Order.findOne({
      _id: id,
      user: user._id,
    })
      .populate("deliveryPartner") // Include delivery partner details instead of only the id
      .populate("user"); // Include customer information with the order

    // Either the order does not exist or it belongs to another user
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

    // Send complete order details to the frontend
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Database access is needed before updating the order
    await connectDB();

    // Only logged-in users should be able to cancel orders
    const user = await getAuthUser();

    if (!user) {
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

    // Read the order id that needs to be updated
    const { id } = await params;

    const status = "Cancelled";

    const order = await Order.findOne({
      _id: id,
      user: user._id,
    });

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

    if (order.status === "Delivered" || order.status === "Cancelled") {
      return NextResponse.json(
        {
          success: false,
          message: `Order already ${order.status}`,
        },
        {
          status: 400,
        },
      );
    }

    // Create a history record so status changes can be tracked later
    const statusEntry = {
      status: status,
      note: `Status changed to customer`,
      timestamp: new Date(),
    };

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status,

        // Append the new status entry without removing older history.
        $push: {
          statusHistory: statusEntry,
        },
      },
      {
        returnDocument: "after",
      },
    );

    // Safety check in case the update fails unexpectedly
    if (!updatedOrder) {
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

    // Return updated order data
    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Connect before removing order data
    await connectDB();

    // Only admins should be able to permanently remove orders
    const admin = await getAdminUser();

    if (!admin) {
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

    // Read the order id from the URL
    const { id } = await params;

    // Remove the order permanently from the database
    const deletedOrder = await Order.findByIdAndDelete(id);

    // Nothing to delete if the order does not exist
    if (!deletedOrder) {
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

    // Confirm successful deletion
    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete order",
      },
      {
        status: 500,
      },
    );
  }
}
