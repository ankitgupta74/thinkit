"use client";

import ProductCard from "@/components/product/ProductCard";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { motion } from "framer-motion";
import { CartTooltip } from "../cart/CartTooltip";
import { Trash2Icon } from "lucide-react";

export default function RecentlyViewedSection({
  currentProductId,
}: {
  currentProductId: string;
}) {
  const { viewedProducts, clearRecentlyViewed } = useRecentlyViewed();

  // Filter out the product the user is currently looking at
  const displayProducts = viewedProducts
    .filter((product) => product._id !== currentProductId)
    .slice(0, 5); // Show max 5 products as per the MVP design

  // Don't render the section if there are no past products to show
  if (displayProducts.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mt-12 mb-44"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-app-green">
            Recently Viewed
          </h2>
          <p className="text-sm text-app-text-light mt-1">
            Pick up where you left off
          </p>
        </div>

        <CartTooltip text="Clear history">
          <button
            onClick={clearRecentlyViewed}
            className="text-sm font-semibold text-app-error hover:text-red-700 flex items-center gap-1 transition-colors active:scale-95"
          >
            <Trash2Icon className="size-4" /> Clear
          </button>
        </CartTooltip>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
        {displayProducts.map((product) => (
          <ProductCard key={`recent-${product._id}`} product={product} />
        ))}
      </div>
    </motion.section>
  );
}
