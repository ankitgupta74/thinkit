// Delivery partner authentication endpoint.

// Login Flow:
//
// Email + Password
// → Verify Rider
// → Generate Token
// → Save Cookie
// → Rider Logged In

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import DeliveryPartner from "@/models/DeliveryPartner";

import { connectDB } from "@/lib/mongodb";
import { generateToken } from "@/lib/jwt";

// Authenticates a delivery partner.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password } = body;

    // Login requires both email and password.
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password required",
        },
        {
          status: 400,
        },
      );
    }

    await connectDB();

    // Find delivery partner using email address.
    const partner = await DeliveryPartner.findOne({
      email: email.toLowerCase(),
    });

    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        },
      );
    }

    // Check if the delivery partner account is active before allowing login.
    if (!partner.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account has been deactivated",
        },
        {
          status: 403,
        },
      );
    }

    // Verify password against stored hash.
    const isMatch = await bcrypt.compare(password, partner.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        },
      );
    }

    // Create authentication token for future requests.
    const token = generateToken(partner._id.toString());

    // Convert database document into a plain object.
    const partnerData = partner.toObject();

    delete partnerData.password;

    const response = NextResponse.json({
      success: true,
      partner: partnerData,
    });

    // Store login token in a secure cookie.
    response.cookies.set("delivery-token", token, {
      // Prevent JavaScript access to the token.
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // Keep rider logged in for 7 days.
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
      },
      {
        status: 500,
      },
    );
  }
}
