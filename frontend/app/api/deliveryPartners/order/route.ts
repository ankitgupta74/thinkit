// Delivery partner order dashboard endpoint.

// Delivery Workflow:
//
// Admin Creates Rider
// → Rider Logs In
// → Order Assigned
// → Rider Sees Assigned Orders
// → Delivery Completed

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/User";
import "@/models/DeliveryPartner";
import { getDeliveryPartner } from "@/lib/deliveryAuth";

// Returns orders assigned to the current rider.
export async function GET() {
  try {
    await connectDB();

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

    // Fetch only orders assigned to this rider.
    const orders = await Order.find({
      deliveryPartner: partner._id,
    })
      .populate("user")
      .sort({
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
