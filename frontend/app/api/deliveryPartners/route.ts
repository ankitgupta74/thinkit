// Delivery partner management endpoint.
//
// GET  → List delivery partners
// POST → Create delivery partner

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/admin";
import DeliveryPartner from "@/models/DeliveryPartner";

// Returns all delivery partners for admin management.
export async function GET() {
  try {
    await connectDB();

    // Only admins should manage delivery partner accounts.
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

    // Show newest delivery partners first.
    const partners = await DeliveryPartner.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      partners,
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

// Creates a new delivery partner account.
export async function POST(request: Request) {
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
