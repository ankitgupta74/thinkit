import {
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react";
import type { Order } from "../../types";
import { statusColors } from "@/public/assets";
import { CURRENCY } from "@/utils/config";

interface DeliveryOrderCardProps {
  // Current order to display in the card
  order: Order;

  // Decides whether we show active actions or completed info
  tab: "active" | "completed";

  // Updates the order status in parent component
  handleUpdateStatus: (orderId: string, status: string) => void;

  // Opens delivery OTP verification modal
  setOtpModal: (orderId: string) => void;

  // Opens cancellation modal for this order
  setCancelModal: (orderId: string) => void;
}

export default function DeliveryOrderCard({
  order,
  tab,
  handleUpdateStatus,
  setOtpModal,
  setCancelModal,
}: DeliveryOrderCardProps) {
  // Sometimes order.user may be missing or contain only an ID.
  // Create a safe fallback object so UI never breaks.
  const user =
    typeof order.user === "object"
      ? order.user
      : { name: "Customer", email: "", phone: "" };

  return (
    <div
      // Single order card container
      key={order._id}
      className="bg-white rounded-2xl border border-app-border overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-app-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Show only last few characters to keep the UI clean */}
          <span className="text-sm font-mono text-zinc-500">
            #{order._id.slice(-6).toUpperCase()}
          </span>
          {/* Status color changes automatically based on current order status */}
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[order.status] || "bg-zinc-100 text-zinc-600"}`}
          >
            {order.status}
          </span>
        </div>
        <span className="text-sm font-semibold text-zinc-900">
          {CURRENCY}
          {order.total.toFixed(2)}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        {/* Customer */}
        <div className="flex items-center gap-2 text-sm">
          <div className="size-8 rounded-full bg-app-cream flex-center">
            {/* Simple avatar using first letter of customer name */}
            <span className="text-xs font-semibold text-app-green">
              {user.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-zinc-900">{user.name}</p>
            {/* Show phone number only if available */}
            {user.phone && (
              <p className="text-xs text-zinc-500 flex items-center gap-1">
                <PhoneIcon className="size-3" /> {user.phone}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-zinc-600">
          <MapPinIcon className="size-4 text-app-green shrink-0 mt-0.5" />
          <p>
            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state} {order.shippingAddress.zip}
          </p>
        </div>

        {/* Items count */}
        <p className="text-xs text-zinc-500">
          {/* Handle singular/plural text automatically */}
          {order.items.length} item{order.items.length > 1 ? "s" : ""} •{" "}
          {order.paymentMethod.toUpperCase()}
        </p>
      </div>

      {/* Actions */}
      {/* Action buttons are only useful for ongoing deliveries */}
      {tab === "active" && (
        <div className="px-5 py-3 border-t border-app-border flex flex-wrap gap-2">
          {(order.status === "Assigned" || order.status === "Packed") && (
            <button
              type="button"
              onClick={() =>
                handleUpdateStatus(
                  order._id,
                  // Move order to the next delivery stage
                  order.status === "Assigned" ? "Packed" : "Out for Delivery",
                )
              }
              className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1.5"
            >
              <TruckIcon className="w-3.5 h-3.5" />

              {order.status === "Assigned" ? "Mark Packed" : "Out for Delivery"}
            </button>
          )}
          {/* Final delivery confirmation requires OTP verification */}
          {order.status === "Out for Delivery" && (
            <button
              type="button"
              onClick={() => setOtpModal(order._id)}
              className="px-4 py-2 text-sm font-medium bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors flex items-center gap-1.5"
            >
              <CheckCircleIcon className="w-3.5 h-3.5" /> Mark Delivered
            </button>
          )}
          {/* Hide cancel option once order is already finished */}
          {order.status !== "Delivered" && order.status !== "Cancelled" && (
            <button
              type="button"
              onClick={() => setCancelModal(order._id)}
              className="px-4 py-2 text-sm font-medium bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-1.5"
            >
              <XCircleIcon className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>
      )}

      {/* Completed orders show delivery date instead of action buttons */}
      {tab === "completed" && (
        <div className="px-5 py-3 border-t border-app-border">
          <p className="text-xs text-zinc-500 flex items-center gap-1">
            <ClockIcon className="size-3" />
            {/* Convert stored date into a user-friendly format */}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
}
