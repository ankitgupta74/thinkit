import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import Address from "@/models/Address";

// Returns all addresses belonging to the current customer.
export async function handleGetAddresses() {
  try {
    await connectDB();

    // Addresses are private and belong to a specific user.
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Load only addresses owned by the current user.
    const addresses = await Address.find({ user: user._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    // Return customer's saved addresses.
    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}
