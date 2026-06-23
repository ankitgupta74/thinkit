// Tracking Flow:
//
// Load Order
// → Load Live Location
// → Show Timeline
// → Show Delivery Partner
// → Track Delivery Progress

"use client";

import dynamic from "next/dynamic";
import OrderOTP from "@/components/order/OrderOTP";
import OrderTimeLine from "@/components/order/OrderTimeLine";
import Loader from "@/components/ui/Loader";
import type { LiveLocation, Order } from "@/types";
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon
} from "lucide-react";
import Image from "next/image";
import {
  useParams,
  useRouter,
  useSearchParams
} from "next/navigation";
import { CURRENCY } from "@/utils/config";
import {
  useEffect,
  useRef,
  useState
} from "react";
import { api } from "@/lib/api";
import { useCart } from "@/context/cart/useCart";
import toast from "react-hot-toast";

const LiveMap = dynamic(() => import("@/components/order/LiveMap"), {
  ssr: false,
});

// Detailed order tracking page.
function Order() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const searchParams = useSearchParams();
  const paymentResult = searchParams.get("payment");

  const { clearCart } = useCart();

  // Prevent the payment-success action from running again during rerenders.
  const hasHandledPaymentSuccess = useRef(false);

  // Complete order information.
  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  // Real-time rider location for delivery tracking.
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);

  // Load full order details.
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

  if (loading) {
    return <Loader />;
  }

  if (!order) {
    return <div className="min-h-screen flex-center">Order not found</div>;
  }

  return (
    <div className="min-h-screen mb-20 bg-app-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-app-text-light hover:text-app-green mb-6 transition-colors"
        >
          <ArrowLeftIcon className="size-4" /> Back to Orders
        </button>
        {/* Order Id, Date and Status */}
        <div className="flex items-center justify-between mb-8">
          <div className="">
            <h1 className="text-2xl font-semibold text-app-green">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-app-text-light mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <span
            className={`px-4 py-1.5 text-sm font-semibold rounded-full ${order.status === "Delivered" ? "bg-green-100 text-green-700" : order.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-app-orange/10 text-app-orange"}`}
          >
            {order.status}
          </span>
        </div>
        {/*  */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Timeline, Map Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* OTP Card */}
            <OrderOTP order={order} />
            {/* Live Tracking Map */}
            <LiveMap order={order} liveLocation={liveLocation} />
            {/* Progress Timeline */}
            <OrderTimeLine order={order} />

            {/* Delivery Person */}
            {order.deliveryPartner &&
              order.status !== "Delivered" &&
              order.status !== "Cancelled" && (
                <div className="bg-white rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-app-green flex-center">
                      <span className="text-white font-semibold text-sm">
                        {order.deliveryPartner.name.charAt(0)}
                      </span>
                    </div>
                    <div className="">
                      <p className="text-sm font-semibold text-app-green">
                        {order.deliveryPartner.name}
                      </p>
                      <p className="text-xs text-app-text-light capitalize">
                        {order.deliveryPartner.vehicleType ?? "Unknown"} •
                        Delivery Partner
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${order.deliveryPartner.phone}`}
                    className="p-2.5 bg-app-cream rounded-xl hover:bg-app-cream-dark transition-colors"
                    aria-label="Call Delivery Partner"
                  >
                    <PhoneIcon className="size-4 text-app-green" />
                  </a>
                </div>
              )}
          </div>
          {/* Right Side - Order details */}
          <div className="space-y-5">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-app-green mb-3 flex items-center gap-2">
                <MapPinIcon className="size-4" />
                Delivery Address
              </h3>
              <p className="text-sm text-app-text-light leading-relaxed">
                {order.shippingAddress.label}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
              </p>
            </div>
            {/* Items */}
            <div className="bg-white rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-app-green mb-3">
                Items ({order.items.length})
              </h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div className="flex items-center gap-3" key={i}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="size-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-app-green truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-app-text-light">
                        ×{item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {CURRENCY}
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-app-border space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-app-text-light">Subtotal</span>
                  <span>
                    {CURRENCY}
                    {order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-text-light">Delivery</span>
                  <span>
                    {order.deliveryFee === 0
                      ? "Free"
                      : `${CURRENCY}${order.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-text-light">Tax</span>
                  <span>
                    {CURRENCY}
                    {order.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between p-2 border-t border-app-border font-semibold text-app-green">
                  <span>Total</span>
                  <span>
                    {CURRENCY}
                    {order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
