// Individual address management endpoint.
//
// PUT    → Update address
// DELETE → Remove address

import {
  NextRequest,
  NextResponse
} from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

import Address from "@/models/Address";

// Dynamic route parameters from the URL.
interface Params {
  params: Promise<{
    id: string;
  }>;
}

// Updates a customer's saved address.
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Database access is required before making changes.
    await connectDB();

    // Users can only modify their own addresses.
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

    // Read address id from the URL.
    const { id } = await params;

    // Updated address information from the frontend.
    const body = await request.json();

    // Prevent editing addresses that belong to another user.
    const address = await Address.findOne({
      _id: id,
      user: user._id,
    });

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found",
        },
        {
          status: 404,
        },
      );
    }

    // Apply updated values to the existing address.
    address.label = body.label;
    address.address = body.address;
    address.city = body.city;
    address.state = body.state;
    address.zip = body.zip;
    address.isDefault = body.isDefault;
    address.lat = body.lat;
    address.lng = body.lng;

    // Persist all address changes.
    await address.save();

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update address",
      },
      {
        status: 500,
      },
    );
  }
}

// Removes one of the customer's saved addresses.
export async function DELETE(_request: NextRequest, { params }: Params) {
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

    const { id } = await params;

    // Only delete addresses owned by the current user.
    const deletedAddress = await Address.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!deletedAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found",
        },
        {
          status: 404,
        },
      );
    }

    // Confirm successful deletion.
    return NextResponse.json({
      success: true,
      message: "Address deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete address",
      },
      {
        status: 500,
      },
    );
  }
}
