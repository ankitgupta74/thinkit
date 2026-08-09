// Tracking Flow:
//
// Load Order
// → Load Live Location
// → Show Timeline
// → Show Delivery Partner
// → Track Delivery Progress

import {
  useState,
  useEffect,
  useRef
} from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart/useCart";
import { api } from "@/lib/api";
import type { Order } from "@/types";
import toast from "react-hot-toast";
import { LiveLocation } from "@/types/liveLocation";

export function useOrderTracking(id: string, paymentResult: string | null) {
  const router = useRouter();
  const { clearCart } = useCart();

  // Prevent the payment-success action from running again during rerenders.
  const hasHandledPaymentSuccess = useRef(false);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);

        // Fetch order information from backend.
        // Load the latest saved order state after opening this tracking page.
        const data = await api<{
          success: boolean;
          order: Order;
        }>(`/orders/${id}`);

        setOrder(data.order);

        // Stripe can redirect before the webhook finishes updating MongoDB.
        // Retry once shortly after the first request when payment is still processing.
        if (
          paymentResult === "success" &&
          !data.order.isPaid &&
          data.order.status === "Payment Pending"
        ) {
          // Give Stripe webhook a short time to update payment status in the database.
          setTimeout(async () => {
            try {
              // Fetch again to receive the updated payment result from the backend.
              const refreshedData = await api<{
                success: boolean;
                order: Order;
              }>(`/orders/${id}`);

              setOrder(refreshedData.order);
            } catch (error) {
              console.error(error);
            }
          }, 1500);
        }
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load your order. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id, paymentResult]);

  // Clear the cart once after the backend confirms the Stripe payment.
  useEffect(() => {
    if (
      paymentResult !== "success" ||
      !order?.isPaid ||
      hasHandledPaymentSuccess.current
    ) {
      return;
    }

    // Mark first so rerenders cannot start the same payment-success flow again.
    hasHandledPaymentSuccess.current = true;

    // Cart is cleared only after backend confirms payment, not just after Stripe redirects back.
    clearCart();

    toast.success("Payment successful. Your order has been placed.");

    // Remove the Stripe result query parameter without adding browser history.
    router.replace(`/orders/${order._id}`);
  }, [paymentResult, order?.isPaid, order?._id, clearCart, router]);

  // Refresh rider location every 10 seconds only while delivery is active.
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    // One tracking request: get rider coordinates and the latest delivery status together.
    const loadLiveLocation = async () => {
      try {
        // This endpoint returns only tracking data for the current customer's order.
        const data = await api<{
          success: boolean;
          liveLocation: LiveLocation | null;
          status: Order["status"];
        }>(`/orders/${id}/location`);

        // Update map state with the newest rider position from the backend.
        setLiveLocation(data.liveLocation);

        // Keep the visible order status synchronized with tracking updates.
        setOrder((currentOrder) =>
          currentOrder
            ? {
                ...currentOrder,
                status: data.status,
              }
            : currentOrder,
        );

        // Stop polling immediately once delivery is no longer active.
        if (data.status !== "Out for Delivery" && intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load live location. Please try again.";

        toast.error(message);
      }
    };

    // Poll only for an active delivery; other order states do not need location updates.
    if (!id || order?.status !== "Out for Delivery") {
      return;
    }

    // Fetch immediately instead of making the customer wait 10 seconds.
    loadLiveLocation();

    // Continue refreshing while the rider is delivering.
    intervalId = setInterval(loadLiveLocation, 10000);

    // Stop polling when the user leaves this order page.
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [id, order?.status]);

  return { order, loading, liveLocation };
}
