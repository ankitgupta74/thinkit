import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import Order from "@/models/Order";

export async function handleCancelOrder(
  _request: NextRequest,
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
