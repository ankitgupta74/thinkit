import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/userAuth";
import Product from "@/models/Product";
import SaveForLaterItem from "@/models/SaveForLaterItem";
import { NextRequest, NextResponse } from "next/server";

export async function handleCreateSaveForLaterItem(request: NextRequest) {
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

    // Prevent duplicate save for later item entries for the same product.
    const existingItem = await SaveForLaterItem.findOne({
      user: user._id,
      product: productId,
    });
    if (existingItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Item already exists in Save For Later",
        },
        // Conflict
        {
          status: 409,
        },
      );
    }

    const saveForLaterItem = await SaveForLaterItem.create({
      user: user._id,
      product: productId,
    });

    await saveForLaterItem.populate({
      path: "product",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Item saved for later successfully.",
        saveForLaterItem,
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
        message: "Failed to add item to Save For Later",
      },
      // Internal Server Error
      {
        status: 500,
      },
    );
  }
}
