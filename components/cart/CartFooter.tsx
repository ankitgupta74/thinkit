"use client";
import { ArrowRightIcon } from "lucide-react";
import { CURRENCY } from "@/utils/config";

export function CartFooter({
  cartTotal,
  deliveryFee,
  grandTotal,
  onCheckout,
}: {
  cartTotal: number;
  deliveryFee: number;
  grandTotal: number;
  onCheckout: () => void;
}) {
  return (
    <div className="shrink-0 px-4 sm:px-5 py-5 border-t border-app-border space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-app-text-light">Subtotal</span>
        <span className="font-medium">
          {CURRENCY}
          {cartTotal.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-app-text-light">Delivery Charges</span>
        <span className="font-medium">
          {deliveryFee === 0 ? (
            <span className="text-app-success">Free</span>
          ) : (
            `${CURRENCY}${deliveryFee.toFixed(2)}`
          )}
        </span>
      </div>
      {deliveryFee > 0 && (
        <p className="text-xs text-app-text-light text-center">
          Free delivery on orders over {CURRENCY}149!
        </p>
      )}
      <div className="flex justify-between text-base font-semibold border-t border-app-border pt-3">
        <span>Total</span>
        <span>
          {CURRENCY}
          {grandTotal.toFixed(2)}
        </span>
      </div>
      <button
        onClick={onCheckout}
        className="w-full py-3 bg-app-orange text-white font-semibold rounded-xl hover:bg-app-orange-dark transition-colors flex-center gap-2 active:scale-[0.98]"
      >
        Proceed to checkout <ArrowRightIcon className="size-4" />
      </button>
    </div>
  );
}
