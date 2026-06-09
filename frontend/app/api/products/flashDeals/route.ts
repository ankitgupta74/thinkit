import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { serverError } from "@/lib/apiError";

export async function GET() {
  try {
    // Connect before reading products from the database
    await connectDB();

    // Show only products that can actually be purchased
    const products = await Product.find({
      stock: { $gt: 0 },
    }).sort({
      // Higher original price products usually have bigger deal potential
      originalPrice: -1,
    });

    // Calculate discount percentage for each product
    const productsWithDiscount = products
      .map((product) => {
        // Convert price difference into a percentage discount
        const discount =
          product.originalPrice && product.price
            ? Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100,
              )
            : 0;

        return {
          ...product.toObject(),
          discount,
        };
      })
      .filter((product) => product.discount > 0);
    // Keep only products that actually have a discount

    // Send flash deal products to the frontend
    return NextResponse.json({
      success: true,
      products: productsWithDiscount,
    });
  } catch (error) {
    // Centralized error handling keeps API responses consistent
    return serverError(error);
  }
}
