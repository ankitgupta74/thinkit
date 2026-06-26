import { useEffect, useRef, useState } from "react";
import type { Order } from "@/types";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

// Session-only memory for the tracking toggle.
// It survives page refreshes but resets when the browser session ends.
const DELIVERY_TRACKING_STORAGE_KEY = "thinkit-delivery-tracking";

// Delivery Workflow:
//
// Load Assigned Orders
// → Accept / Update Delivery Status
// → Share Location
// → Verify OTP
// → Complete Delivery
export function useDeliveryDashboard() {
  // Stores all orders assigned to the delivery partner
  const [orders, setOrders] = useState<Order[]>([]);

  // Controls loading UI while orders are being fetched
  const [loading, setLoading] = useState(true);

  // Switches between active and completed deliveries
  const [tab, setTab] = useState<"active" | "completed">("active");

  // Tracks whether live location sharing is enabled
  const [tracking, setTracking] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    // Start with the last tracking choice saved for this browser session.
    return sessionStorage.getItem(DELIVERY_TRACKING_STORAGE_KEY) === "true";
  });

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

  // Stores the browser interval used for location sharing.
  // Keep the interval id outside state because changing it should not re-render the page.
  const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  // Prevents multiple location requests from running at the same time.
  // Lock location requests so a slow request cannot overlap with the next 10-second interval.
  const isSendingLocationRef = useRef(false);

  // Prevent repeated error toasts when the browser temporarily cannot refresh location.
  // Remember temporary location errors so the rider does not receive the same toast every 10 seconds.
  const hasShownLocationErrorRef = useRef(false);

  // Save the tracking toggle in session storage whenever the rider changes it.
  useEffect(() => {
    sessionStorage.setItem(DELIVERY_TRACKING_STORAGE_KEY, String(tracking));
  }, [tracking]);

  useEffect(() => {
    // Load orders assigned to the current delivery partner.
    const loadOrders = async () => {
      try {
        setLoading(true);

        // Fetch rider-specific orders from backend.
        const data = await api<{
          success: boolean;
          orders: Order[];
        }>(`/deliveryPartners/order?status=${tab}`);

        setOrders(data.orders);
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load orders. Please try again.";

        toast.error(message);

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    // Reload orders whenever the selected tab changes
  }, [tab]);

  // Share rider location every 10 seconds while tracking is enabled.
  useEffect(() => {
    // Send the rider's current browser location to every delivery currently on the road.
    // Read the browser's current position, then send it to each active delivery order.
    const sendLiveLocation = async () => {
      // Do not start another request while the previous location request is still running.
      if (isSendingLocationRef.current) {
        return;
      }

      // Location sharing only matters for orders currently being delivered.
      const outForDeliveryOrders = orders.filter(
        (order) => order.status === "Out for Delivery",
      );

      if (outForDeliveryOrders.length === 0) {
        return;
      }

      if (!navigator.geolocation) {
        toast.error("Location is not supported by this browser.");
        setTracking(false);
        return;
      }

      isSendingLocationRef.current = true;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Save the same rider location for every active on-road delivery.
            // One rider location can belong to multiple orders when the rider is handling them together.
            await Promise.all(
              outForDeliveryOrders.map((order) =>
                api<{
                  success: boolean;
                  message: string;
                }>(`/deliveryPartners/order/${order._id}/location`, {
                  method: "PUT",
                  body: {
                    lat: latitude,
                    lng: longitude,
                  },
                }),
              ),
            );
          } catch (error) {
            console.error(error);

            toast.error(
              error instanceof Error
                ? error.message
                : "Unable to share live location",
            );
          } finally {
            isSendingLocationRef.current = false;
          }
        },
        (error) => {
          console.error(error);

          isSendingLocationRef.current = false;

          // Permission denial must stop tracking because future attempts will also fail.
          if (error.code === error.PERMISSION_DENIED) {
            setTracking(false);
            sessionStorage.removeItem(DELIVERY_TRACKING_STORAGE_KEY);
            toast.error(
              "Location permission was denied. Enable it in browser settings.",
            );
            return;
          }

          // Timeout or temporary position-unavailable errors can succeed on the next 10-second retry.
          if (!hasShownLocationErrorRef.current) {
            toast.error("Unable to refresh location. Retrying automatically.");
            hasShownLocationErrorRef.current = true;
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        },
      );
    };

    // Check this once before starting the interval.
    // Tracking should run only while at least one order is on the road.
    const hasOutForDeliveryOrder = orders.some(
      (order) => order.status === "Out for Delivery",
    );

    // Stop tracking when rider disables it or no delivery is currently on the road.
    // Do not allow location sharing before an order has reached Out for Delivery.
    if (!tracking || !hasOutForDeliveryOrder) {
      if (locationIntervalRef.current !== null) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }

      return;
    }

    // Send immediately so the customer does not wait 10 seconds for the first update.
    sendLiveLocation();

    // Continue sending location while the rider is delivering.
    locationIntervalRef.current = setInterval(sendLiveLocation, 10000);

    // Clear the interval when dashboard unmounts or tracking conditions change.
    return () => {
      if (locationIntervalRef.current !== null) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
  }, [tracking, orders]);

  // Update delivery progress and keep the changed order in local dashboard state.
  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      setSubmitting(true);

      // Move this rider's assigned order to its next allowed delivery stage.
      // The backend validates whether this status change is allowed for the current order.
      const data = await api<{
        success: boolean;
        message: string;
        order: Order;
      }>(`/deliveryPartners/order/${orderId}/status`, {
        method: "PUT",
        body: {
          status,
        },
      });

      // Replace only the changed order in local state.
      // This keeps the dashboard in sync without reloading the full page.
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? data.order : order,
        ),
      );

      toast.success(data.message || `Order updated to ${status}`);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update delivery status",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Verify OTP before marking order as delivered.
  const handleComplete = async () => {
    if (!otpModal || otp.length !== 6) return;

    try {
      setSubmitting(true);

      // Verify customer OTP and mark this rider's order as delivered.
      // Backend checks the OTP before it allows the order to become Delivered.
      const data = await api<{
        success: boolean;
        message: string;
        order: Order;
      }>(`/deliveryPartners/order/${otpModal}/complete`, {
        method: "PUT",
        body: {
          otp,
        },
      });

      // Replace the completed order with the latest backend version.
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === otpModal ? data.order : order,
        ),
      );

      toast.success(data.message || "Delivery completed successfully");

      // Close modal and clear temporary OTP state.
      setOtpModal(null);
      setOtp("");
      setTracking(false);
      sessionStorage.removeItem(DELIVERY_TRACKING_STORAGE_KEY);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to complete delivery",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel delivery and store cancellation reason.
  // Cancel the currently selected delivery and release the rider.
  const handleCancel = async () => {
    if (!cancelModal || !cancelReason.trim()) {
      toast.error("Please provide a cancellation reason.");
      return;
    }

    try {
      setSubmitting(true);

      // Backend records the reason and removes this rider from the cancelled delivery.
      const data = await api<{
        success: boolean;
        message: string;
        order: Order;
      }>(`/deliveryPartners/order/${cancelModal}/cancel`, {
        method: "PUT",
        body: {
          reason: cancelReason.trim(),
        },
      });

      // Replace local order with the final backend version.
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === cancelModal ? data.order : order,
        ),
      );

      toast.success(data.message || "Delivery cancelled");

      // Clear temporary modal state after successful cancellation.
      setCancelModal(null);
      setCancelReason("");
      setTracking(false);
      sessionStorage.removeItem(DELIVERY_TRACKING_STORAGE_KEY);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to cancel delivery",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
  };
}
