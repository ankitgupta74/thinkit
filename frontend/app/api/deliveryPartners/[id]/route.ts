// Admin endpoint for updating delivery partner information.

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DeliveryPartner from "@/models/DeliveryPartner";
import { getAdminUser } from "@/lib/admin";

// Updates an existing delivery partner account.
export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
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
    const body = await request.json();

    // Save the updated delivery partner details.
    const partner = await DeliveryPartner.findByIdAndUpdate(id, body, {
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
