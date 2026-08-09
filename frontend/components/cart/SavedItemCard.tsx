"use client";
import Image from "next/image";
import { Trash2Icon, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { CURRENCY } from "@/utils/config";
import { CartTooltip } from "./CartTooltip";

type Props = {
  product: Product;
  savedId: string;
  isProcessing: boolean;
  onMoveToCart: (savedId: string, product: Product) => void;
  onDelete: (savedId: string) => void;
};

export function SavedItemCard({
  product,
  savedId,
  isProcessing,
  onMoveToCart,
  onDelete,
}: Props) {
  return (
    <div className="flex gap-3 bg-white border border-app-border/40 rounded-xl p-3 overflow-hidden">
      <Image
        src={product.image}
        alt={product.name}
        width={64}
        height={64}
        className={`size-16 rounded-lg object-cover shrink-0 transition-all duration-500 ${isProcessing ? "grayscale" : "grayscale-[0.3] hover:grayscale-0"}`}
      />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="text-sm font-medium truncate text-app-text-light">
              {product.name}
            </h4>
            <p className="text-[11px] text-app-text-light mt-0.5">
              /{product.unit}
            </p>
          </div>
          <span className="text-sm font-medium text-app-text-light whitespace-nowrap">
            {CURRENCY}
            {product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-end mt-2 gap-1">
          <CartTooltip text="Move to cart">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onMoveToCart(savedId, product)}
              className="p-1.5 text-app-text-light hover:text-app-success hover:bg-green-50 rounded-lg transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="size-4" />
            </button>
          </CartTooltip>
          <CartTooltip text="Delete saved">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onDelete(savedId)}
              className="p-1.5 text-app-text-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2Icon className="size-4" />
            </button>
          </CartTooltip>
        </div>
      </div>
    </div>
  );
}
