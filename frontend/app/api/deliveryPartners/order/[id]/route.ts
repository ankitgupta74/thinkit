import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/User";
import "@/models/DeliveryPartner";
import { getDeliveryPartner } from "@/lib/deliveryAuth";

// Returns orders assigned to the current rider.
export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
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

    // Read one order ID from the dynamic URL: /order/[id].
    const { id } = await context.params;

    // Fetch only orders assigned to this rider.
    // Match both order ID and rider ID so another rider cannot open this delivery.
    const order = await Order.findOne({
      _id: id,
      deliveryPartner: partner._id,
    })
      // Include customer contact details needed by the delivery partner.
      .populate("user", "name email phone");

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Delivery not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      order,
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
