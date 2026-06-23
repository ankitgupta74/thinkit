// Customer address management endpoint.
//
// GET  → Fetch saved addresses
// POST → Create a new address


import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

import Address from "@/models/Address";

// Returns all addresses belonging to the current customer.
export async function GET() {
  try {
    await connectDB();

    // Addresses are private and belong to a specific user.
    const user = await getAuthUser();

    if (!user) {
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

    // Load only addresses owned by the current user.
    const addresses = await Address.find({
      user: user._id,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    // Return customer's saved addresses.
    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch addresses",
      },
      {
        status: 500,
      },
    );
  }
}

// Creates a new delivery address for the customer.
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser();

    if (!user) {
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

    // Address information entered during profile setup or checkout.
    const body = await request.json();

    const { label, address, city, state, zip, isDefault, lat, lng } = body;

    // Save a new address linked to the current user.
    const newAddress = await Address.create({
      label,
      address,
      city,
      state,
      zip,
      isDefault,
      lat,
      lng,

      user: user._id,
    });

    return NextResponse.json({
      success: true,
      address: newAddress,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create address",
      },
      {
        status: 500,
      },
    );
  }
}
