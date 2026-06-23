// Delivery partner order dashboard endpoint.

// Delivery Workflow:
//
// Admin Creates Rider
// → Rider Logs In
// → Order Assigned
// → Rider Sees Assigned Orders
// → Delivery Completed

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/User";
import "@/models/DeliveryPartner";
import { getDeliveryPartner } from "@/lib/deliveryAuth";

// Returns orders assigned to the current rider.
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Read dashboard filter from URL, for example: ?status=active.
    const { searchParams } = new URL(request.url);

    // This decides which delivery group the rider wants to see.
    const status = searchParams.get("status");

    // Identify which rider is making the request.
    const partner = await getDeliveryPartner();

    // Only authenticated riders can view assigned deliveries.
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

    // Start with the safety rule: rider can see only their own orders.
    const query: Record<string, unknown> = {
      deliveryPartner: partner._id,
    };

    // Active means the rider still has work to do on this delivery.
    if (status === "active") {
      query.status = {
        $in: ["Assigned", "Packed", "Out for Delivery"],
      };
    }
    // Completed includes both successfully delivered and cancelled deliveries.
    if (status === "completed") {
      query.status = {
        $in: ["Delivered", "Cancelled"],
      };
    }

    // Fetch this rider's orders after applying the selected dashboard filter.
    const orders = await Order.find(query).populate("user").sort({
      createdAt: -1,
    });

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
