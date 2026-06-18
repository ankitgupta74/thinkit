// Delivery Workflow:
//
// Load Assigned Orders
// → Accept / Update Delivery Status
// → Share Location
// → Verify OTP
// → Complete Delivery

"use client";

import { useEffect, useState } from "react";
import { PackageIcon, NavigationIcon } from "lucide-react";
import Loader from "@/components/ui/Loader";
import DeliveryOrderCard from "@/components/delivery/DeliveryOrderCard";
import OtpModal from "@/components/delivery/OTPModal";
import CancelModal from "@/components/delivery/CancelModal";
import type { Order } from "@/types";

export default function DeliveryDashboard() {
  // Stores all orders assigned to the delivery partner
  const [orders, setOrders] = useState<Order[]>([]);

  // Controls loading UI while orders are being fetched
  const [loading, setLoading] = useState(true);

  // Switches between active and completed deliveries
  const [tab, setTab] = useState<"active" | "completed">("active");

  // Tracks whether live location sharing is enabled
  const [tracking, setTracking] = useState(false);

  // OTP modal

  // Stores the selected order id for OTP verification
  const [otpModal, setOtpModal] = useState<string | null>(null);

  // Stores the OTP entered by the customer
  const [otp, setOtp] = useState("");

  // Prevents duplicate actions while request is running
  const [submitting, setSubmitting] = useState(false);

  // Cancel modal

  // Stores the selected order id for cancellation
  const [cancelModal, setCancelModal] = useState<string | null>(null);

  // Stores the cancellation reason entered by the partner
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    // Load orders assigned to the current delivery partner.
    const loadOrders = async () => {
      try {
        setLoading(true);

        // Fetch rider-specific orders from backend.
        const response = await fetch("/api/deliveryPartners/order");

        const data = await response.json();

        if (!data.success) {
          setOrders([]);
          return;
        }

        // Split orders into active and completed views.
        const filteredOrders =
          tab === "active"
            ? data.orders.filter(
                (order: Order) =>
                  !["Delivered", "Cancelled"].includes(order.status),
              )
            : data.orders.filter((order: Order) =>
                ["Delivered", "Cancelled"].includes(order.status),
              );

        setOrders(filteredOrders);
      } catch (error) {
        console.error(error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    // Reload orders whenever the selected tab changes
  }, [tab]);

  // Future: update delivery progress in database.
  const handleUpdateStatus = async (orderId: string, status: string) => {
    // Later this will call an API to update order status
    console.log(orderId, status);
  };

  // Verify OTP before marking order as delivered.
  const handleComplete = async () => {
    // Don't continue if order or OTP is missing
    if (!otpModal || !otp) return;
    setSubmitting(true);

    // Simulating API request
    setTimeout(() => {
      setSubmitting(false);

      // Close modal and clear OTP after successful verification
      setOtpModal(null);
      setOtp("");
    }, 1000);
  };

  // Cancel delivery and store cancellation reason.
  const handleCancel = async () => {
    // Don't continue if no order is selected
    if (!cancelModal) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);

      // Close modal and clear cancellation reason
      setCancelModal(null);
      setCancelReason("");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Tabs + Tracking toggle */}
      {/* Switch between active and completed deliveries */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Generate tab buttons from a single source array */}
        {(["active", "completed"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${tab === t ? "bg-app-green text-white" : "bg-white text-zinc-600 hover:bg-app-cream border border-app-border"}`}
          >
            {t === "active" ? "Active" : "Completed"}
          </button>
        ))}
        <div className="ml-auto">
          {/* Toggle live location sharing on/off */}
          <button
            type="button"
            // Use previous state value to safely toggle tracking
            onClick={() => setTracking((prev) => !prev)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${tracking ? "bg-green-600 text-white" : "bg-white text-zinc-600 border border-app-border hover:bg-app-cream"}`}
          >
            <NavigationIcon
              className={`w-3.5 h-3.5 ${tracking ? "animate-pulse" : ""}`}
            />
            {tracking ? "Sharing Location" : "Share Location"}
          </button>
        </div>
      </div>

      {/* Orders */}
      {/* Handle loading, empty state, and data state */}
      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        // Show a friendly message when no orders exist
        <div className="text-center py-16 bg-white rounded-2xl border border-app-border">
          <PackageIcon className="size-12 text-app-border mx-auto mb-3" />
          <p className="text-lg font-semibold text-zinc-900 mb-1">
            No {tab} deliveries
          </p>
          <p className="text-sm text-zinc-500">
            {tab === "active"
              ? "You'll see new assignments here"
              : "Completed deliveries will appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Render one card for each order */}
          {orders.map((order) => (
            <DeliveryOrderCard
              key={order._id}
              order={order}
              tab={tab}
              handleUpdateStatus={handleUpdateStatus}
              setOtpModal={setOtpModal}
              setCancelModal={setCancelModal}
            />
          ))}
        </div>
      )}

      {/* OTP Modal */}
      {/* Only show OTP modal when an order is selected */}
      {otpModal && (
        <OtpModal
          setOtpModal={setOtpModal}
          otp={otp}
          setOtp={setOtp}
          handleComplete={handleComplete}
          submitting={submitting}
        />
      )}
      {/* Cancel Modal */}
      {/* Only show cancellation modal when needed */}
      {cancelModal && (
        <CancelModal
          setCancelModal={setCancelModal}
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          handleCancel={handleCancel}
          submitting={submitting}
        />
      )}
    </div>
  );
}
