import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import Order from "@/models/Order";
import "@/models/User";
import "@/models/Product";
import "@/models/DeliveryPartner";

export async function handleGetOrder(
  _request: NextRequest,
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
