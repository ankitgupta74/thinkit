import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import Address from "@/models/Address";

// Dynamic route parameters from the URL.
interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function handleUpdateAddress(
  request: NextRequest,
  { params }: Params,
) {
  try {
    // Database access is required before making changes.
    await connectDB();

    // Users can only modify their own addresses.
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
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
        { success: false, message: "Address not found" },
        { status: 404 },
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

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update address" },
      { status: 500 },
    );
  }
}
