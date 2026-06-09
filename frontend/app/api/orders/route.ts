import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Order from "@/models/Order";

import "@/models/DeliveryPartner";
import "@/models/Product";
import "@/models/User";
import { getAuthUser } from "@/lib/auth";
import Product from "@/models/Product";

export async function GET() {
  try {
    // Connect before reading user orders
    await connectDB();

    // Orders are private, so the user must be logged in
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // Orders are private, so the user must be logged in
    const orders = await Order.find({
      user: user._id,
    })
      .populate("deliveryPartner") // Replace delivery partner id with actual partner details
      .sort({
        createdAt: -1, // Show newest orders first
      });

    // Send user's order history to the frontend
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      },
    );
  }
}

// Snapshot of product details stored inside an order
// This keeps order history unchanged even if product data changes later
type OrderItem = {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
};

export async function POST(request: NextRequest) {
  try {
    // Database access is needed for product checks and order creation
    await connectDB();

    // Only logged-in users can place orders
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // Read checkout information sent from the frontend
    const { items, shippingAddress, paymentMethod } = await request.json();

    // Prevent creating empty orders
    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No order items",
        },
        {
          status: 400,
        },
      );
    }

    // Collect product ids so all products can be fetched in one query
    const productIds = items.map((item: { product: string }) => item.product);

    // Always use product data from the database instead of trusting frontend values
    const products = await Product.find({
      _id: { $in: productIds },
    });

    // Create fast lookup by product id
    const productMap = new Map();

    products.forEach((product) => {
      productMap.set(product._id.toString(), product);
    });

    // Verify every requested item is still available
    for (const item of items) {
      const product = productMap.get(item.product);

      // Stop checkout if stock is insufficient
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `${product?.name || "Product"} out of stock`,
          },
          {
            status: 400,
          },
        );
      }
    }

    // Copy trusted product information into the order
    const orderItems: OrderItem[] = items.map(
      (item: { product: string; quantity: number }) => {
        const dbProduct = productMap.get(item.product);

        // Safety check in case a product disappears during processing
        if (!dbProduct) {
          throw new Error(`Product ${item.product} not found`);
        }

        return {
          product: dbProduct._id.toString(),
          name: dbProduct.name,
          image: dbProduct.image,
          price: dbProduct.price,
          quantity: item.quantity,
          unit: dbProduct.unit,
        };
      },
    );

    // Safety check in case a product disappears during processing
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const deliveryFee = subtotal > 149 ? 0 : 49;

    const tax = Math.round(subtotal * 0.08 * 100) / 100;

    // Final amount customer needs to pay
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

    // Create the order and save a snapshot of checkout data
    const order = await Order.create({
      user: user._id,

      items: orderItems,

      shippingAddress,

      paymentMethod,

      subtotal,

      deliveryFee,

      tax,

      total,

      status: "Placed",

      // Track how the order moves through its lifecycle
      statusHistory: [
        {
          status: "Placed",
          note: "Order placed successfully",
          timestamp: new Date(),
        },
      ],
    });

    // Reduce inventory after successful order creation
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    // Return fully populated order data for immediate UI updates
    const populatedOrder = await Order.findById(order._id)
      .populate("user")
      .populate("items.product");
    // Replace referenced ids with actual documents

    // Send completed order back to the frontend
    return NextResponse.json({
      success: true,
      order: populatedOrder,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
      },
      {
        status: 500,
      },
    );
  }
}
