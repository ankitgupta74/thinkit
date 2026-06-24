import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/User";
import "@/models/DeliveryPartner";
import { getDeliveryPartner } from "@/lib/deliveryAuth";

// Completes one assigned delivery after customer OTP verification.
export async function PUT(
  request: NextRequest,
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

    // Only the logged-in rider can complete their assigned delivery.
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

    // Read the OTP shared by the customer at the delivery location.
    const { otp } = await request.json();

    if (!otp) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP required",
        },
        {
          status: 400,
        },
      );
    }

    const { id } = await context.params;

    // Fetch only orders assigned to this rider.
    const order = await Order.findOne({
      _id: id,
      deliveryPartner: partner._id,
    }).populate("user", "name email phone");

    // Completed or cancelled orders cannot be delivered again.
    if (
      !order ||
      order.status === "Cancelled" ||
      order.status === "Delivered"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request",
        },
        {
          status: 400,
        },
      );
    }

    // Delivery can finish only when the customer's OTP matches the saved order OTP.
    if (order.deliveryOtp !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        {
          status: 400,
        },
      );
    }

    const history = Array.isArray(order.statusHistory)
      ? [...order.statusHistory]
      : [];

    history.push({
      status: "Delivered",
      note: "Delivered by partner",
      timestamp: new Date(),
    });

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: "Delivered",
        statusHistory: history,
        // A COD order is paid when the rider successfully collects cash at delivery.
        // Card orders were already marked paid by the Stripe webhook.
        isPaid: true,
        // Clear the OTP after use so it cannot be reused later.
        deliveryOtp: "",
      },
      {
        returnDocument: "after",
      },
    );

    return NextResponse.json({
      success: true,
      message: "Order completed successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to complete delivery",
      },
      {
        status: 500,
      },
    );
  }
}
