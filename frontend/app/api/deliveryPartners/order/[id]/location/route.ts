import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

import { getDeliveryPartner } from "@/lib/deliveryAuth";

// Delivery partner live-location update endpoint.
//
// PUT /api/deliveryPartners/order/:id/location
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Connect before checking or updating order data.
    await connectDB();

    // Identify the currently logged-in delivery partner.
    const partner = await getDeliveryPartner();

    // Only authenticated riders can send live location updates.
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

    // Read rider coordinates from the request body.
    const { lat, lng } = await request.json();

    // Coordinates must be real numeric values.
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid latitude and longitude are required",
        },
        {
          status: 400,
        },
      );
    }

    // Latitude must stay within Earth's valid coordinate range.
    if (lat < -90 || lat > 90) {
      return NextResponse.json(
        {
          success: false,
          message: "Latitude must be between -90 and 90",
        },
        {
          status: 400,
        },
      );
    }

    // Longitude must stay within Earth's valid coordinate range.
    if (lng < -180 || lng > 180) {
      return NextResponse.json(
        {
          success: false,
          message: "Longitude must be between -180 and 180",
        },
        {
          status: 400,
        },
      );
    }

    // Read the assigned order id from the URL.
    const { id } = await params;

    // Rider can update location only for their own active delivery.
    const order = await Order.findOne({
      _id: id,
      deliveryPartner: partner._id,
      status: {
        $in: ["Assigned", "Packed", "Out for Delivery"],
      },
    });

    // Prevent updates for another rider's, cancelled, or completed order.
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Active delivery not found",
        },
        {
          status: 404,
        },
      );
    }

    // Store the newest rider position for customer tracking.
    order.liveLocation = {
      lat,
      lng,
      updatedAt: new Date(),
    };

    await order.save();

    // Confirm that the location update was saved.
    return NextResponse.json({
      success: true,
      message: "Live location updated successfully",
      liveLocation: order.liveLocation,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update live location",
      },
      {
        status: 500,
      },
    );
  }
}
