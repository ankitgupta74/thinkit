import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import WishlistItem from "@/models/WishlistItem";
import { NextRequest, NextResponse } from "next/server";

export async function handleDeleteWishlistItem(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please Sign In and try again.",
        },
        {
          status: 401,
        },
      );
    }

    // Read the wishlist item id from the URL
    const { id } = await params;

    const deletedWishlistItem = await WishlistItem.findOneAndDelete(
      {
        _id: id,
        user: user._id,
      }
    );
    if (!deletedWishlistItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Wishlist item does not exist in your wishlist.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item removed successfully from your wishlist"
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove wishlist item",
      },
      {
        status: 500,
      },
    );
  }
}
