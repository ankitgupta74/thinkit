import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import Address from "@/models/Address";

// Creates a new delivery address for the customer.
export async function handleCreateAddress(request: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
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

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create address" },
      { status: 500 },
    );
  }
}
