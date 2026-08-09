"use client";

import {
  PackageIcon,
  UsersIcon,
  ShoppingBagIcon,
  AlertTriangleIcon,
} from "lucide-react";
import Link from "next/link";
import { CURRENCY } from "@/utils/config";
import Loader from "@/components/ui/Loader";
import { statusColors } from "@/public/assets";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

export default function AdminDashboard() {
  const { stats, loading } = useAdminDashboard();

  // Build dashboard cards from data.
  // Makes the UI easier to maintain and expand.
  // Convert API data into UI card configuration.
  const cards = stats
    ? [
        {
          label: "Total Orders",
          value: stats.totalOrders,
          // Store icon components in data so UI can render them dynamically
          icon: ShoppingBagIcon,
        },
        {
          label: "Total Products",
          value: stats.totalProducts,
          icon: PackageIcon,
        },
        {
          label: "Out of Stock",
          value: stats.outOfStock,
          icon: AlertTriangleIcon,
        },
        {
          label: "Total Users",
          value: stats.totalUsers,
          icon: UsersIcon,
        },
        {
          label: "Total Partners",
          value: stats.totalPartners,
          icon: UsersIcon,
        },
      ]
    : [];

  // Show loader until dashboard data is available
  if (loading) return <Loader />;

  return (
    // Main dashboard content
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Create dashboard cards from configuration data */}
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-5 border border-app-border flex justify-between gap-3"
          >
            <div>
              <p className="text-2xl font-semibold text-zinc-900">
                {card.value}
              </p>
              <p className="text-sm text-app-text-light">{card.label}</p>
            </div>
            <div
              className={`size-10 rounded-xl flex-center bg-orange-50 text-orange-600`}
            >
              {/* Render the icon assigned to this card */}
              <card.icon className="size-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
        <div className="px-6 py-5 border-b border-app-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Orders</h2>
          <Link
            // Navigate to the complete orders management page
            href="/admin/orders"
            className="text-sm font-medium text-app-orange hover:text-app-orange-dark transition-colors"
          >
            View All →
          </Link>
        </div>
        {/* Allow table scrolling on smaller screens */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-app-cream/50 text-zinc-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {/* Show a friendly message when no orders exist */}
              {stats?.recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-zinc-500"
                  >
                    No orders yet.
                  </td>
                </tr>
              ) : (
                // Render latest orders for quick admin overview
                stats?.recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {/* Show only the last part of the id to keep the table readable */}
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-900">
                        {/* Show fallback text if customer information is missing */}
                        {order.user?.name || "—"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {order.user?.email || ""}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {/* Prevent errors if items data is unavailable */}
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {/* Use app-wide currency configuration */}
                      {CURRENCY}
                      {order.total?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {/* Status color changes automatically based on order status */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-zinc-100 text-zinc-600"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    {/* Convert stored date into a user-friendly format */}
                    <td className="px-6 py-4 text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
