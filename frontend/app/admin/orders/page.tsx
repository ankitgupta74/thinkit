"use client";

import { useState, useEffect } from "react";
import { TruckIcon } from "lucide-react";
import toast from "react-hot-toast";
import type { DeliveryPartner, Order } from "@/types";

import {
  dummyDashboardOrdersData,
  dummyDeliveryPartnerData,
} from "@/public/assets";
import Loader from "@/components/ui/Loader";
import { CURRENCY } from "@/utils/config";

export default function AdminOrders() {
  // Stores all customer orders
  const [orders, setOrders] = useState<Order[]>([]);

  // Stores available delivery partners
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);

  // Controls loading screen while data is being fetched
  const [loading, setLoading] = useState(true);

  // Stores the order id currently being assigned
  const [assignModal, setAssignModal] = useState<string | null>(null);

  // Stores the selected delivery partner id
  const [selectedPartner, setSelectedPartner] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      // Temporary dummy data until backend APIs are connected
      setOrders(dummyDashboardOrdersData);
      setPartners(dummyDeliveryPartnerData);

      // Hide loader once data is ready
      setLoading(false);
    }, 1000);

    // Clean up timer when component unmounts
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Later this will update order status through an API
    console.log(id, newStatus);
  };

  const handleAssign = async () => {
    // Don't continue until both order and partner are selected
    if (!assignModal || !selectedPartner) return;
    toast.success("Delivery partner assigned!");

    // Close modal and clear previous selection
    setAssignModal(null);
    setSelectedPartner("");
  };

  // Central list of all allowed order statuses
  const statusOptions = [
    "Placed",
    "Confirmed",
    "Assigned",
    "Packed",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  // Maps each status to its badge color
  const statusColors: Record<string, string> = {
    Placed: "bg-blue-100 text-blue-800",
    Confirmed: "bg-amber-100 text-amber-800",
    Assigned: "bg-indigo-100 text-indigo-800",
    Packed: "bg-cyan-100 text-cyan-800",
    "Out for Delivery": "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  // Show loader until all required data is ready
  if (loading) return <Loader />;

  return (
    <>
      {/* Orders management table */}
      <div className="bg-white rounded-2xl shadow-sm border border-app-border overflow-hidden">
        <div className="px-6 py-5 border-b border-app-border">
          <h2 className="text-xl font-semibold text-zinc-900">Orders</h2>
        </div>
        <div className="overflow-x-auto">
          {/* Table view is useful for managing many orders at once */}
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-app-cream/50 text-zinc-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Delivery Partner</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {/* Show message when no orders exist */}
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-zinc-500"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                // Render one row per order
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-900">
                        {/* Show only the last few characters for readability */}
                        #{order._id.slice(-6)}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-900">
                        {/* Handle cases where user data is missing */}
                        {typeof order.user === "object"
                          ? order.user.name
                          : "Unknown User"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {typeof order.user === "object" ? order.user.email : ""}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {CURRENCY}
                      {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {/* Show assigned partner details if available */}
                      {order.deliveryPartner ? (
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-app-green flex-center">
                            <span className="text-white text-[10px] font-semibold">
                              {order.deliveryPartner.name?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-zinc-900">
                              {order.deliveryPartner.name}
                            </p>
                            <p className="text-[10px] text-zinc-500">
                              {order.deliveryPartner.phone}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            // Open assignment modal for this order
                            setAssignModal(order._id);
                            // Clear any previous partner selection
                            setSelectedPartner("");
                          }}
                          className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                        >
                          <TruckIcon className="size-3" /> Assign
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        aria-label="Order status"
                        // Allows admin to update order progress
                        value={order.status}
                        // Send order id and newly selected status
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-r-8 border-transparent outline-none cursor-pointer leading-tight ${statusColors[order.status] || "bg-zinc-100 text-zinc-800"}`}
                      >
                        {/* Generate dropdown options from a single source array */}
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {/* Show assignment modal only when an order is selected */}
      {assignModal && (
        <>
          <div
            // Clicking outside closes the modal
            className="fixed inset-0 bg-app-cream/80 backdrop-blur z-50"
            onClick={() => setAssignModal(null)}
          />
          <div className="fixed inset-0 z-50 flex-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in">
              <h3 className="text-lg font-semibold text-app-green mb-4">
                Assign Delivery Partner
              </h3>
              {/* No partner available for assignment */}
              {partners.length === 0 ? (
                <p className="text-sm text-zinc-500 mb-4">
                  No active delivery partners. Please onboard a partner first.
                </p>
              ) : (
                <div className="space-y-2 mb-5 max-h-60 overflow-y-auto">
                  {/* Render all available partners as selectable options */}
                  {partners.map((p) => (
                    <label
                      key={p._id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedPartner === p._id ? "border-app-green bg-app-green/5" : "border-app-border hover:bg-app-cream"}`}
                    >
                      <input
                        type="radio"
                        // Only one delivery partner can be selected
                        name="partner"
                        value={p._id}
                        // Highlight the currently selected partner
                        checked={selectedPartner === p._id}
                        onChange={() => setSelectedPartner(p._id)}
                        className="text-app-green"
                      />
                      <div className="size-8 rounded-full bg-app-green flex-center">
                        <span className="text-white text-xs font-semibold">
                          {p.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          {p.name}
                        </p>
                        <p className="text-xs text-zinc-500 capitalize">
                          {p.vehicleType} • {p.phone}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  // Close modal without assigning
                  onClick={() => setAssignModal(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssign}
                  // Disable until a partner is selected
                  disabled={!selectedPartner}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-app-green rounded-xl hover:bg-app-green-light transition-colors disabled:opacity-50"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
