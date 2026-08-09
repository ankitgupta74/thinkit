// Order Placement Flow:
//
// Review Address
// → Review Cart Items
// → Confirm Total
// → Create Order

import {
  CheckIcon,
  TruckIcon
} from "lucide-react";
import type { Address } from "../../types";
import { CURRENCY } from "@/utils/config";
import Image from "next/image";
import type { CartItem } from "@/types";

interface CheckoutReviewProps {
  address: Address | null;
  items: CartItem[];
  handlePlaceOrder: () => void;
  loading: boolean;
  total: number;
}

// Final checkout step before order creation.
export default function CheckoutReview({
  address,
  items,
  handlePlaceOrder,
  loading,
  total,
}: CheckoutReviewProps) {
  return (
    <div className="bg-white rounded-2xl p-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-app-green mb-5 flex items-center gap-2">
        <CheckIcon className="size-5" /> Review Your Order
      </h2>

      {/* Delivery Info */}
      <div className="mb-5 p-4 bg-app-cream rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <TruckIcon className="size-4 text-app-green" />
          <span className="text-sm font-semibold text-app-green">
            Delivery Address
          </span>
        </div>
        <p className="text-sm text-app-text-light">
          {address
            ? `${address.label} — ${address.address}, ${address.city}, ${address.state} ${address.zip}`
            : "No address selected"}
        </p>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-5">
        {items.map((item) => (
          <div key={item.product._id} className="flex items-center gap-3">
            <Image
              src={item.product.image}
              alt={item.product.name}
              width={100}
              height={100}
              className="size-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-app-green">
                {item.product.name}
              </p>
              <p className="text-xs text-app-text-light">
                Qty: {item.quantity}
              </p>
            </div>
            <span className="text-sm font-semibold">
              {CURRENCY}
              {(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        // Create order using selected address and cart items.
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full py-3 bg-app-orange text-white font-semibold rounded-xl hover:bg-app-orange-dark transition-colors disabled:opacity-60 active:scale-[0.98]"
      >
        {loading
          ? "Placing Order..."
          : `Place Order — ${CURRENCY}${total.toFixed(2)}`}
      </button>
    </div>
  );
}
