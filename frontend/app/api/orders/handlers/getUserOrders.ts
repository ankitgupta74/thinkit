import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import Order from "@/models/Order";

export async function handleGetUserOrders() {
  try {
    // Connect before reading user orders
    await connectDB();

    // Orders are private, so the user must be logged in
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

    // Fetch only orders that belong to the logged-in customer.
    const orders = await Order.find({
      user: user._id,
    })
      .populate("deliveryPartner") // Replace delivery partner id with actual partner details
      .sort({
        createdAt: -1, // Show newest orders first
      });

    // Send user's order history to the frontend
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      },
    );
  }
}
