"use client";
import Image from "next/image";
import {
  MinusIcon,
  PlusIcon,
  Trash2Icon,
  Bookmark
} from "lucide-react";
import { CURRENCY } from "@/utils/config";
import { CartTooltip } from "./CartTooltip";
import type { Product } from "@/types";

type Props = {
  product: Product;
  quantity: number;
  isProcessing: boolean;
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onSave: (id: string) => void;
};

export function CartItemCard({
  product,
  quantity,
  isProcessing,
  onUpdate,
  onRemove,
  onSave,
}: Props) {
  return (
    <div className="shrink-0 flex gap-3 bg-app-cream/60 rounded-xl p-3 overflow-hidden">
      <Image
        src={product.image}
        alt={product.name}
        width={64}
        height={64}
        className="size-16 rounded-lg object-cover shrink-0"
      />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="text-sm font-semibold truncate text-app-text transition-colors">
              {product.name}
            </h4>
            <p className="text-xs text-app-text-light mt-0.5">
              {CURRENCY}
              {product.price.toFixed(2)} / {product.unit}
            </p>
          </div>
          <span className="text-sm font-semibold whitespace-nowrap text-app-text">
            {CURRENCY}
            {(product.price * quantity).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div
            className={`flex items-center gap-1 bg-white rounded-lg border border-app-border/60 p-0.5 shadow-sm transition-opacity ${
              isProcessing ? "opacity-50" : "opacity-100"
            }`}
          >
            <CartTooltip text="Decrease">
              <button
                disabled={isProcessing}
                onClick={() => onUpdate(product._id, quantity - 1)}
                className="size-6 rounded-md hover:bg-app-cream flex-center transition-colors active:scale-90 text-app-text disabled:cursor-not-allowed"
              >
                <MinusIcon className="size-3" />
              </button>
            </CartTooltip>
            <span className="text-xs font-semibold w-6 text-center">
              {quantity}
            </span>
            <CartTooltip text="Increase">
              <button
                disabled={isProcessing}
                onClick={() => onUpdate(product._id, quantity + 1)}
                className="size-6 rounded-md hover:bg-app-cream flex-center transition-colors active:scale-90 text-app-text disabled:cursor-not-allowed"
              >
                <PlusIcon className="size-3" />
              </button>
            </CartTooltip>
          </div>
          <div className="flex items-center gap-1">
            <CartTooltip text="Save for later">
              <button
                disabled={isProcessing}
                onClick={() => onSave(product._id)}
                className="p-1.5 hover:text-app-orange hover:bg-orange-50 rounded-lg"
              >
                <Bookmark className="size-4" />
              </button>
            </CartTooltip>
            <CartTooltip text="Remove item">
              <button
                disabled={isProcessing}
                onClick={() => onRemove(product._id)}
                className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2Icon className="size-4" />
              </button>
            </CartTooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
