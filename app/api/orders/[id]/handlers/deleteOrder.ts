import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/adminAuth";
import Order from "@/models/Order";

export async function handleDeleteOrder(
  _request: NextRequest,
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
    const deletedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: "Cancelled",
        cancelledAt: new Date(),
      },
      {
        returnDocument: "after",
      },
    );

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
