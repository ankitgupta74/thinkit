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

// Removes one of the customer's saved addresses.
export async function handleDeleteAddress(
  _request: NextRequest,
  { params }: Params,
) {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
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
        { success: false, message: "Address not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Address deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete address" },
      { status: 500 },
    );
  }
}
