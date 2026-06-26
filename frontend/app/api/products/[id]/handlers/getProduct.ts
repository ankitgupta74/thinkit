import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { serverError } from "@/lib/apiError";
import { calculateDiscount } from "@/utils/calculateDiscount";

export async function handleGetProduct(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Read product id from the dynamic route: /api/products/[id]
    const { id } = await params;

    // Avoid unnecessary database queries for invalid ids
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Product ID",
        },
        {
          status: 404,
        },
      );
    }

    // Connect before searching for the product
    await connectDB();

    // Find the requested product
    const product = await Product.findById(id);

    // Return a clear message when the product does not exist
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    // Calculate discount dynamically from current prices
    // Build discount from the current saved prices before sending this product.
    const discount = calculateDiscount(product.price, product.originalPrice);

    // Send product details back to the frontend
    return NextResponse.json({
      success: true,
      product: {
        // Keep database product data, then add the calculated field for the frontend.
        ...product.toObject(),
        discount,
      },
    });
  } catch (error) {
    return serverError(error);
  }
}
