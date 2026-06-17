import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { serverError } from "@/lib/apiError";
import { getAdminUser } from "@/lib/admin";

export async function GET(
  request: NextRequest,
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
    const discount =
      product.originalPrice && product.price
        ? Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) *
              100,
          )
        : 0;

    // Send product details back to the frontend
    return NextResponse.json({
      success: true,
      product: {
        ...product.toObject(),
        discount,
      },
    });
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(
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

export async function DELETE(
  request: NextRequest,
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
    await Product.findByIdAndDelete(id);

    // Inform the frontend that deletion completed successfully
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return serverError(error);
  }
}
