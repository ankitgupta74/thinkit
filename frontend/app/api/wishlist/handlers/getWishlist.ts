import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import WishlistItem from "@/models/WishlistItem";
import "@/models/Product";
import { NextResponse } from "next/server";

// Returns all wishlist items belonging to the current customer.
export async function handleGetWishlist() {
  try {
    // DB connection
    await connectDB();

    // Wishlist items are private and belong to a specific user.
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

    // Load only wishlist items owned by the current user.
    const wishlist = await WishlistItem.find({
      user: user._id,
    })
      // Replace product id with actual product details
      .populate("product")
      // Show newest wishlisted items first
      .sort({
        createdAt: -1,
      });

    // Return customer's wishlist.
    return NextResponse.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch wishlist",
      },
      {
        status: 500,
      },
    );
  }
}
