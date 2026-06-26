import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { serverError } from "@/lib/apiError";
import { getAdminUser } from "@/lib/adminAuth";

export async function handleUpdateProduct(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Only admins can modify product information
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

    // Read updated product data sent from the form
    const body = await request.json();
    const {
      name,
      description,
      price,
      originalPrice,
      image,
      category,
      unit,
      stock,
      isOrganic,
    } = body;

    // Clean incoming values before validation and saving
    const productName = name?.trim();
    const productCategory = category?.trim();
    const productDescription = description?.trim() || "";
    const productUnit = unit?.trim() || "piece";
    const productImage = image?.trim() || "";

    // These fields are required for every product
    if (!productName || !productCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and category are required",
        },
        {
          status: 400,
        },
      );
    }

    // Prevent invalid pricing values
    if (Number(price) < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Price cannot be negative",
        },
        {
          status: 400,
        },
      );
    }

    // Stock quantity cannot be negative
    if (Number(stock) < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Stock cannot be negative",
        },
        {
          status: 400,
        },
      );
    }

    // Original price should represent the higher pre-discount price
    if (
      originalPrice &&
      Number(originalPrice) > 0 &&
      Number(originalPrice) < Number(price)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Original price must be greater than price",
        },
        {
          status: 400,
        },
      );
    }

    // Confirm the product exists before updating it
    await connectDB();
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
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

    // Update product and return the latest version
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name: productName,
        description: productDescription,
        price: Number(price),
        originalPrice: Number(originalPrice) || 0,
        image: productImage,
        category: productCategory,
        unit: productUnit,
        stock: Number(stock) || 0,
        isOrganic: Boolean(isOrganic),
      },
      {
        returnDocument: "after",
      },
    );

    // Return updated product data to refresh the UI
    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return serverError(error);
  }
}
