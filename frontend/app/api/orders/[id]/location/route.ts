import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import Order from "@/models/Order";
import { serverError } from "@/lib/apiError";

// Customer order tracking endpoint.

// API Flow:
// Customer Request → Verify Login → Verify Order Ownership → Fetch Tracking Data → Return Location & Status


// Returns live delivery tracking information for a specific customer order.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Required before checking order information.
    await connectDB();

    // Make sure the request comes from a logged-in user.
    const user = await getAuthUser();

    // Delivery tracking is only available to authenticated users.
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

    // Read the order ID from the URL.
    const { id } = await params;

    // Only allow users to track their own orders.
    const order = await Order.findOne({
      _id: id,
      // Prevent access to another customer's order.
      user: user._id,
    })
      // Fetch only the fields needed for tracking.
      .select("liveLocation status");

    // Order either doesn't exist or doesn't belong to this user.
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

    // Send the latest delivery location and order status.
    return NextResponse.json({
      success: true,

      // Current rider location (if available).
      liveLocation: order.liveLocation,

      // Current delivery stage of the order.
      status: order.status,
    });
  } catch (error) {
    // Reuse common server error handling.
    console.log(error);
    return serverError(error);
  }
}
