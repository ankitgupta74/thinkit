import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { serverError } from "@/lib/apiError";
import { getAdminUser } from "@/lib/adminAuth";

export async function handleCreateProduct(request: NextRequest) {
  try {
    // Only admins are allowed to create new products
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

    // Read product information sent from the admin form
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

    // Clean and normalize incoming values before validation
    const productName = name?.trim();
    const productCategory = category?.trim();
    const productDescription = description?.trim() || "";
    const productUnit = unit?.trim() || "piece";
    const productImage = image?.trim() || "";

    // Minimum information required to create a product
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

    // Prevent invalid pricing data
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

    // Original price should represent the higher pre-discount value
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

    // Save the validated product into the database
    await connectDB();
    const product = await Product.create({
      name: productName,
      description: productDescription,
      price: Number(price),
      originalPrice: Number(originalPrice) || 0,
      image: productImage,
      category: productCategory,
      unit: productUnit,
      stock: Number(stock) || 0,
      isOrganic: Boolean(isOrganic),
    });

    // Return the newly created product to the frontend
    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return serverError(error);
  }
}
