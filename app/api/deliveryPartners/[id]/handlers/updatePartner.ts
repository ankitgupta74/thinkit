import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DeliveryPartner from "@/models/DeliveryPartner";
import { getAdminUser } from "@/lib/adminAuth";

export async function handleUpdatePartner(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    // Delivery partner management is restricted to admins.
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

    // Read the delivery partner id from the URL.
    const { id } = await context.params;

    // Updated information submitted by the admin.
    const { name, phone, vehicleType, isActive } = await request.json();

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    if (vehicleType !== undefined) {
      updateData.vehicleType = vehicleType;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Save the updated delivery partner details.
    const partner = await DeliveryPartner.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });

    return NextResponse.json({
      success: true,
      partner,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 },
    );
  }
}
