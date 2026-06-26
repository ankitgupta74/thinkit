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
import { useCheckout } from "@/hooks/useCheckout";

// Multi-step checkout process.
function Checkout() {
  const router = useRouter();

  const {
    items,
    cartTotal,
    addresses,
    address,
    setAddress,
    addressesLoading,
    step,
    setStep,
    paymentMethod,
    setPaymentMethod,
    loading,
    deliveryFee,
    tax,
    total,
    handlePlaceOrder,
  } = useCheckout();

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
