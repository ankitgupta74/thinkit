"use client";

import { motion } from "framer-motion";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import type { Product } from "@/types";
import { CartTooltip } from "../cart/CartTooltip";

type Props = {
  product: Product;
  wishlisted: boolean;
  inCart: boolean;
  cartQuantity: number;
  displayQuantity: number;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onGoToCart: () => void;
};

const ProductActions = ({
  product,
  wishlisted,
  inCart,
  cartQuantity,
  displayQuantity,
  onToggleWishlist,
  onAddToCart,
  onGoToCart,
}: Props) => {
  return (
    <>
      <CartTooltip text={wishlisted ? "Remove" : "Save"}>
        <motion.button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product._id);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="size-12 shrink-0 rounded-xl border border-app-border bg-white shadow-sm hover:bg-app-cream transition-colors flex-center"
        >
          <HeartIcon
            className={`size-5 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`}
          />
        </motion.button>
      </CartTooltip>

      <CartTooltip
        className="flex-1"
        text={
          product.stock <= 0
            ? "Out of Stock"
            : inCart
              ? "Go to Cart"
              : "Add to Cart"
        }
      >
        <motion.button
          type="button"
          aria-label={inCart ? "Go to cart" : "Add to cart"}
          disabled={product.stock <= 0}
          onClick={(e) => {
            e.stopPropagation();
            if (product.stock <= 0) return;
            if (inCart) onGoToCart();
            else onAddToCart(product, displayQuantity);
          }}
          whileHover={product.stock > 0 ? { y: -2, scale: 1.02 } : {}}
          whileTap={product.stock > 0 ? { scale: 0.97 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`h-12 w-full px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            product.stock <= 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-app-border"
              : inCart
                ? "bg-app-green text-white shadow-md hover:bg-app-green/90"
                : "bg-app-orange text-white shadow-sm hover:bg-app-orange-dark"
          }`}
        >
          <ShoppingCartIcon className="size-5 shrink-0" />
          <span className="truncate">
            {product.stock <= 0
              ? "Out of Stock"
              : inCart
                ? `Added (${cartQuantity})`
                : "Add to Cart"}
          </span>
        </motion.button>
      </CartTooltip>
    </>
  );
};

export default ProductActions;
