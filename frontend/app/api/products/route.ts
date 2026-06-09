import { getAdminUser } from "@/lib/admin";
import { serverError } from "@/lib/apiError";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Read filter and sorting values from the URL query string
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const organic = searchParams.get("organic");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");

    // Build MongoDB query step-by-step based on active filters
    const query: Record<string, unknown> = {};

    // Filter products by selected category
    if (category && category !== "all") {
      query.category = category;
    }

    // Show only organic products when requested
    if (organic === "true") {
      query.isOrganic = true;
    }

    // Search product names using partial text matching
    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Create price filter only when a range is provided
    if (minPrice || maxPrice) {
      query.price = {};
    }

    if (minPrice) {
      (query.price as Record<string, number>).$gte = Number(minPrice);
    }

    if (maxPrice) {
      (query.price as Record<string, number>).$lte = Number(maxPrice);
    }

    // Decide how products should be ordered in the result
    let sortOption = {};

    if (sort === "price_ascending") {
      sortOption = { price: 1 };
    } else if (sort === "price_descending") {
      sortOption = { price: -1 };
    } else if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "name") {
      sortOption = { name: 1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    // Database connection is needed before reading products
    await connectDB();

    const products = await Product.find(query).sort(sortOption).lean();

    // Calculate discount dynamically instead of storing it manually
    const productsWithDiscount = products.map((product) => {
      const discount =
        product.originalPrice && product.price
          ? Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100,
            )
          : 0;

      return {
        ...product,
        discount,
      };
    });

    // Send filtered product list back to the client
    return NextResponse.json({
      success: true,
      count: productsWithDiscount.length,
      products: productsWithDiscount,
    });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
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
