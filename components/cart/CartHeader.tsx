"use client";
import { ShoppingBagIcon, XIcon } from "lucide-react";
import { CartTooltip } from "./CartTooltip";

export function CartHeader({
  count,
  onClose,
}: {
  count: number;
  onClose: () => void;
}) {
  return (
    <div className="shrink-0 flex items-center justify-between px-4 sm:px-5 py-5 border-b border-app-border">
      <div className="flex items-center gap-2">
        <ShoppingBagIcon className="size-5" />
        <h2 className="text-lg font-medium">Your Cart</h2>
        <span className="px-2 py-0.5 text-xs font-semibold bg-app-cream rounded-full">
          {count} items
        </span>
      </div>
      <CartTooltip text="Close cart">
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-app-cream transition-colors"
        >
          <XIcon className="size-5" />
        </button>
      </CartTooltip>
    </div>
  );
}
