// Admin dashboard statistics endpoint.

// Dashboard Flow:
//
// Verify Admin
// → Collect System Metrics
// → Fetch Recent Orders
// → Return Dashboard Data

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/admin";

import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import DeliveryPartner from "@/models/DeliveryPartner";

// Returns summary information for the admin dashboard.
export async function GET() {
  try {
    await connectDB();

    // Dashboard data should only be visible to admins.
    const user = await getAdminUser();

    // Block customers from accessing business metrics.
    if (!user || !user.isAdmin) {
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

    // Total orders placed in the system.
    const totalOrders = await Order.countDocuments();

    // Total registered customers.
    const totalUsers = await User.countDocuments();

    // Total products available in the catalog.
    const totalProducts = await Product.countDocuments();

    // Total delivery partners in the system.
    const totalPartners = await DeliveryPartner.countDocuments();

    // Products that currently have no inventory available.
    const outOfStock = await Product.countDocuments({
      stock: 0,
    });

    // Recent orders displayed in the dashboard activity section.
    const recentOrders = await Order.find()
      // Include customer information for admin visibility.
      .populate({
        path: "user",
        select: "name email",
      })
      .sort({
        createdAt: -1,
      })
      // Convert documents into plain objects for faster reads.
      .lean();

    // Return dashboard statistics and recent activity.
    return NextResponse.json({
      success: true,
      totalOrders,
      totalUsers,
      totalProducts,
      totalPartners,
      recentOrders,
      outOfStock,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
