"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Star, Trash2Icon } from "lucide-react";
import { CURRENCY } from "@/utils/config";
import { Product, WishlistItem } from "@/types";

interface WishlistCardProps {
  item: WishlistItem & {
    product: Product;
  };

  onMoveToCart: () => Promise<void>;

  onRemove: () => Promise<void>;
}

function WishlistCard({ item, onMoveToCart, onRemove }: WishlistCardProps) {
  const router = useRouter();
  const product = item.product;
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-md transition-all duration-300 group animate-fade-in cursor-pointer"
      onClick={() => router.push(`/products/${product._id}`)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
          className="object-cover p-4 group-hover:p-2 transition-all duration-300"
        />
        {/* Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.discount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-app-orange text-white rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label="Remove from wishlist"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-3 right-3 z-10 size-9 rounded-full bg-white shadow hover:bg-red-50 flex-center transition-colors text-gray-400 hover:text-red-500"
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>
      {/* Info */}
      <div className="p-3.5 text-zinc-700">
        <h3 className="text-sm leading-snug mb-1.5 line-clamp-2">
          {product.name}
        </h3>
        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="size-3 text-app-warning fill-app-warning" />
            <span className="text-xs font-medium text-app-text">
              {product.rating}
            </span>
            <span className="text-xs text-app-text-light">
              ({product.reviewCount})
            </span>
          </div>
        )}
        {/* Price + Add */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate">
            <span className="text-base font-medium">
              {CURRENCY}
              {product.price.toFixed(1)}
            </span>
            <span className="text-xs text-app-text-light block">
              /{product.unit}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-app-text-light line-through ml-1.5">
                {CURRENCY}
                {product.originalPrice.toFixed(1)}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="Move to Cart"
            onClick={(e) => {
              e.stopPropagation();
              onMoveToCart();
            }}
            className="size-8 rounded-full bg-app-orange text-white flex-center shrink-0 hover:bg-app-orange-dark transition-colors active:scale-95"
          >
            <ShoppingCart className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;
