"use client";

import { PackageIcon, NavigationIcon } from "lucide-react";
import Loader from "@/components/ui/Loader";
import DeliveryOrderCard from "@/components/delivery/DeliveryOrderCard";
import OtpModal from "@/components/delivery/OTPModal";
import CancelModal from "@/components/delivery/CancelModal";
import toast from "react-hot-toast";
import { useDeliveryDashboard } from "@/hooks/useDeliveryDashboard";

export default function DeliveryDashboard() {
  const {
    orders,
    loading,
    tab,
    setTab,
    tracking,
    setTracking,
    otpModal,
    setOtpModal,
    otp,
    setOtp,
    submitting,
    cancelModal,
    setCancelModal,
    cancelReason,
    setCancelReason,
    handleUpdateStatus,
    handleComplete,
    handleCancel,
  } = useDeliveryDashboard();

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
            onClick={() => {
              const hasOutForDeliveryOrder = orders.some(
                (order) => order.status === "Out for Delivery",
              );

              if (!tracking && !hasOutForDeliveryOrder) {
                toast.error(
                  "Start an Out for Delivery order before sharing location.",
                );
                return;
              }

              setTracking((prev) => !prev);
            }}
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
