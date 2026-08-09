import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { serverError } from "@/lib/apiError";
import { calculateDiscount } from "@/utils/calculateDiscount";

export async function handleGetFlashDeals() {
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
      // Add a calculated discount to every product before deciding if it is a deal.
      .map((product) => {
        // Convert price difference into a percentage discount
        const discount = calculateDiscount(
          product.price,
          product.originalPrice,
        );

        return {
          ...product.toObject(),
          discount,
        };
      })
      // A flash deal must have a real price reduction.
      .filter((product) => product.discount > 0);

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
