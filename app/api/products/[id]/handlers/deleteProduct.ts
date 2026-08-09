import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { serverError } from "@/lib/apiError";
import { getAdminUser } from "@/lib/adminAuth";

export async function handleDeleteProduct(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Product deletion is restricted to admins
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        {
          status: 403,
        },
      );
    }

    // Read product id from the URL
    const { id } = await params;
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

    // Database connection is required before deletion
    await connectDB();

    // Verify the product exists before removing it
    const product = await Product.findById(id);

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

    // Permanently remove the product from the database
    await Product.findByIdAndUpdate(
      id,
      {
        // if we delete the product directly from database, then it will show error to those who ordered them. So, make the stock to 0.
        stock: 0,
      },
      {
        returnDocument: "after",
      },
    );

    // Inform the frontend that deletion completed successfully
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return serverError(error);
  }
}
