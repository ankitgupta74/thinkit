import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/adminAuth";
import Order from "@/models/Order";
import DeliveryPartner from "@/models/DeliveryPartner";
import { ACTIVE_DELIVERY_STATUSES } from "@/lib/orderStatus";

// API Flow:

// Admin Request 
// → Select Rider 
// → Verify Order & Rider 
// → Generate Delivery OTP 
// → Assign Rider 
// → Update Order Status

export async function handleAssignRider(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    // Only admins should be able to manage rider assignments.
    const admin = await getAdminUser();

    if (!admin || !admin.isAdmin) {
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

    // Rider selected by the admin.
    const { partnerId } = await request.json();

    const { id } = await params;

    if (!partnerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Partner id required",
        },
        {
          status: 400,
        },
      );
    }

    // Verify that the selected rider exists.
    const partner = await DeliveryPartner.findById(partnerId);

    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          message: "Partner not found",
        },
        {
          status: 404,
        },
      );
    }

    const activeOrder = await Order.findOne({
      deliveryPartner: partnerId,
      status: {
        $in: ACTIVE_DELIVERY_STATUSES,
      },
    });

    if (activeOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Delivery partner already assigned to another order",
        },
        {
          status: 400,
        },
      );
    }

    // Find the order that needs rider assignment.
    const order = await Order.findById(id);

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

    if (order.deliveryPartner) {
      return NextResponse.json(
        {
          success: false,
          message: "Delivery partner already assigned",
        },
        {
          status: 400,
        },
      );
    }

    // Preserve previous timeline entries before adding a new one.
    const history = Array.isArray(order.statusHistory)
      ? [...order.statusHistory]
      : [];

    // Record rider assignment in the order timeline.
    history.push({
      status: "Assigned",
      note: `Assigned to ${partner.name}`,
      timestamp: new Date(),
    });

    // Customer will use this OTP to verify successful delivery.
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save rider details and move the order into Assigned status.
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        deliveryPartner: partner._id,
        deliveryOtp: otp,
        status: "Assigned",
        statusHistory: history,
      },
      {
        returnDocument: "after",
      },
    )
      // Return complete rider and customer information.
      .populate("deliveryPartner")
      .populate("user");

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to assign partner",
      },
      {
        status: 500,
      },
    );
  }
}
