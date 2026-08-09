import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/adminAuth";

import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import DeliveryPartner from "@/models/DeliveryPartner";

// Dashboard Flow:
//
// Verify Admin
// → Collect System Metrics
// → Fetch Recent Orders
// → Return Dashboard Data

export async function handleGetDashboardStats() {
  try {
    await connectDB();

    // Dashboard data should only be visible to admins.
    const user = await getAdminUser();

    // Block customers/guests from accessing business metrics.
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Run independent queries concurrently instead of waiting for each one
    const [totalOrders, totalUsers, totalProducts, totalPartners, outOfStock] =
      await Promise.all([
        // Total orders placed in the system.
        Order.countDocuments(),

        // Total registered customers.
        User.countDocuments(),

        // Total products available in the catalog.
        Product.countDocuments(),

        // Total delivery partners in the system.
        DeliveryPartner.countDocuments(),

        // Products that currently have no inventory available.
        Product.countDocuments({ stock: 0 }),
      ]);

    // Recent orders displayed in the dashboard activity section.
    const recentOrders = await Order.find()
      .populate({ path: "user", select: "name email" })
      .populate({ path: "deliveryPartner", select: "name phone" })
      .sort({ createdAt: -1 })
      .limit(8)
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
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
