import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/adminAuth";
import DeliveryPartner from "@/models/DeliveryPartner";

export async function handleCreatePartner(request: NextRequest) {
  try {
    await connectDB();

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

    const body = await request.json();

    // Prevent duplicate delivery partner accounts.
    const existing = await DeliveryPartner.findOne({
      email: body.email,
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 },
      );
    }

    // Store a secure password instead of plain text.
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Save the new delivery partner.
    const partner = await DeliveryPartner.create({
      ...body,
      password: hashedPassword,
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
