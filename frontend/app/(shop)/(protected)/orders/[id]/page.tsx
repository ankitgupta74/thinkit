"use client";

import dynamic from "next/dynamic";
import OrderOTP from "@/components/order/OrderOTP";
import OrderTimeLine from "@/components/order/OrderTimeLine";
import Loader from "@/components/ui/Loader";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import type { Order } from "@/types";
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

const LiveMap = dynamic(() => import("@/components/order/LiveMap"), {
  ssr: false,
});

// Detailed order tracking page.
function Order() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const searchParams = useSearchParams();
  const paymentResult = searchParams.get("payment");

  const { order, loading, liveLocation } = useOrderTracking(id, paymentResult);

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
