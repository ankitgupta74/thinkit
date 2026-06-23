// Checkout Flow:
//
// Load Addresses
// → Select Address
// → Select Payment
// → Review Order
// → Create Order
// → Redirect To Orders

"use client";

import CheckoutAddress from "@/components/checkout/CheckoutAddress";
import CheckoutPayment from "@/components/checkout/CheckoutPayment";
import CheckoutReview from "@/components/checkout/CheckoutReview";
import { useCart } from "@/context/cart/useCart";
import { Address } from "@/types";
import { CURRENCY } from "@/utils/config";
import Loader from "@/components/ui/Loader";
import {
  ArrowLeft,
  CheckIcon,
  ChevronRightIcon,
  CreditCardIcon,
  MapPinIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast/headless";

// Multi-step checkout process.
function Checkout() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [step, setStep] = useState("address");

  // Load customer addresses for checkout.
  useEffect(() => {
    async function loadAddresses() {
      try {
        // Fetch saved delivery addresses.
        // Load addresses from the backend instead of depending on old user data in memory.
        const data = await api<{
          success: boolean;
          addresses: Address[];
        }>("/addresses");

        // Keep one safe array value even if backend returns no saved addresses.
        const loadedAddresses = data.addresses || [];

        setAddresses(loadedAddresses);

        // Prefer default address, otherwise use first saved address.
        const defaultAddress =
          loadedAddresses.find((savedAddress) => savedAddress.isDefault) ||
          loadedAddresses[0];

        if (defaultAddress) {
          setAddress(defaultAddress);
        }
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load addresses. Please try again.";

        toast.error(message);
      } finally {
        setAddressesLoading(false);
      }
    }

    loadAddresses();
  }, []);

  // Selected payment option.
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Free delivery for qualifying orders.
  const deliveryFee = cartTotal > 149 ? 0 : 49;
  const tax = cartTotal * 0.08;
  const total = cartTotal + deliveryFee + tax;

  // Checkout progress indicator.
  const steps: {
    key: string;
    label: string;
    icon: typeof MapPinIcon;
  }[] = [
    {
      key: "address",
      label: "Address",
      icon: MapPinIcon,
    },
    {
      key: "payment",
      label: "Payment",
      icon: CreditCardIcon,
    },
    {
      key: "review",
      label: "Review",
      icon: CheckIcon,
    },
  ];

  // Convert checkout data into a backend order.
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      if (!address) {
        throw new Error("Please select a delivery address.");
      }

      // Send order creation request to backend.
      // Backend creates the order and decides whether payment needs Stripe Checkout.
      const data = await api<{
        success: boolean;
        order?: {
          _id: string;
        };
        orderId?: string;
        checkoutUrl?: string | null;
      }>("/orders", {
        method: "POST",
        body: {
          // Send only essential order data to backend.
          // Send product IDs and quantities only; backend reads trusted product prices itself.
          items: items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),

          shippingAddress: address,
          paymentMethod,
        },
      });

      // Card payment returns Stripe's hosted Checkout URL.
      if (data.checkoutUrl) {
        // Leave this app temporarily and let Stripe collect the card payment securely.
        window.location.href = data.checkoutUrl;
        return;
      }

      // Order completed successfully.
      // Non-card order is complete here, so remove purchased items from local cart state.
      clearCart();

      // Redirect customer to order history.
      if (!data.order?._id) {
        throw new Error(
          "Order was created but no checkout destination was returned.",
        );
      }

      router.push(`/orders/${data.order._id}`);
      toast.success("Order placed successfully");
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to place your order. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (addressesLoading) {
    return <Loader />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-app-cream flex-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-app-green mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-app-text-light mb-4">
            Add some products to checkout
          </p>
          <button
            className="px-5 py-2.5 bg-app-green text-white text-sm font-medium rounded-xl hover:bg-app-green-light transition-colors"
            type="button"
            onClick={() => router.push("/products")}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-app-text-light hover:text-app-green mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <h1 className="text-xl font-semibold text-app-green mb-8">Checkout</h1>
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {/* Render checkout progress navigation */}
          {steps.map((s, i) => (
            <div className="flex items-center gap-2" key={s.key}>
              <button
                type="button"
                onClick={() => setStep(s.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${step === s.key ? "bg-app-green text-white" : "bg-white text-app-text-light"}`}
              >
                <s.icon className="size-4" /> {s.label}
                {i < steps.length - 1 && (
                  <ChevronRightIcon className="size-4 text-app-text-light" />
                )}
              </button>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="md:col-span-2">
            {step === "address" && (
              <CheckoutAddress
                address={address}
                setAddress={setAddress}
                setStep={setStep}
                user={{ addresses }}
              />
            )}
            {step === "payment" && (
              <CheckoutPayment
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                setStep={setStep}
              />
            )}
            {step === "review" && (
              <CheckoutReview
                address={address}
                items={items}
                handlePlaceOrder={handlePlaceOrder}
                loading={loading}
                total={total}
              />
            )}
          </div>
          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-2xl p-5 h-fit sticky top-24">
            <h3 className="text-sm font-semibold text-app-green mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-app-text-light">
                  Subtotal ({items.length} items)
                </span>
                <span>
                  {CURRENCY}
                  {cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-text-light">
                  Delivery ({items.length} items)
                </span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-app-success">Free</span>
                  ) : (
                    `${CURRENCY}${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-text-light">Tax</span>
                <span>
                  {CURRENCY}
                  {tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-app-border text-base font-semibold">
                <span>Total</span>
                <span className="text-app-green">
                  {CURRENCY}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
