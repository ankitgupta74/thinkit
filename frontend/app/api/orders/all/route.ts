import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/User";
import "@/models/Product";
import "@/models/DeliveryPartner";
import { getAdminUser } from "@/lib/admin";

// Admin order management endpoint.

// API Flow:
// Admin Request → Verify Admin Access → Fetch Orders → Include User & Rider Details → Return Results


// Admin endpoint for viewing all orders in the system.
// Used for order management and monitoring.
export async function GET() {
  try {
    // Ensure database access before reading order data.
    await connectDB();

    // Verify that the current user has admin privileges.
    const user = await getAdminUser();

    // Protect this endpoint from normal customer accounts.
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

    // Load all orders along with customer and rider details.
    const orders = await Order.find()
      // Replace user ID with basic customer information.
      .populate("user", "name email")
      // Replace rider ID with delivery partner information.
      .populate("deliveryPartner", "name email phone avatar vehicleType")
      // Show newest orders first in the admin dashboard.
      .sort({
        createdAt: -1,
      });

    // Return the complete order list to the admin panel.
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    // Handle unexpected database or server failures.
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
