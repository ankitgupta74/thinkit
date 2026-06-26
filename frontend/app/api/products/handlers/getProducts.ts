import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { serverError } from "@/lib/apiError";
import { calculateDiscount } from "@/utils/calculateDiscount";

export async function handleGetProducts(request: NextRequest) {
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
    // Add the latest discount to each product response without storing it in MongoDB.
    const productsWithDiscount = products.map((product) => {
      // Build discount from the current saved prices before sending this product.
      const discount = calculateDiscount(product.price, product.originalPrice);

      return {
        ...product,
        // Frontend receives this ready-to-display percentage with the product.
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
