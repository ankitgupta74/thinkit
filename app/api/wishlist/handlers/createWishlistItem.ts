import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import Product from "@/models/Product";
import WishlistItem from "@/models/WishlistItem";
import { NextRequest, NextResponse } from "next/server";

export async function handleCreateWishlistItem(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please Sign In and try again.",
        },
        // Unauthorized
        {
          status: 401,
        },
      );
    }

    // Product selected by the customer.
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product is required!",
        },
        // Bad Request
        {
          status: 400,
        },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product is unavailable",
        },
        // Not Found
        {
          status: 404,
        },
      );
    }

    // Prevent duplicate wishlist entries for the same product.
    const existingItem = await WishlistItem.findOne({
      user: user._id,
      product: productId,
    });
    if (existingItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Item already exists in wishlist",
        },
        // Conflict
        {
          status: 409,
        },
      );
    }

    const wishlistItem = await WishlistItem.create({
      user: user._id,
      product: productId,
    });

    await wishlistItem.populate({
      path: "product",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Item added successfully to your wishlist",
        wishlistItem,
      },
      // Created
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add item to your wishlist",
      },
      // Internal Server Error
      {
        status: 500,
      },
    );
  }
}
