import { useCallback, useState } from "react";
import type { Product } from "@/types";

const STORAGE_KEY = "thinkit_recently_viewed";
const MAX_ITEMS = 6; // Keep 6 in storage so we can safely show 5 (excluding the current one)

export function useRecentlyViewed() {
  const [viewedProducts, setViewedProducts] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse recently viewed products", error);
      return [];
    }
  });

  // Add a product to the list
  const addProduct = useCallback((product: Product) => {
    setViewedProducts((prev) => {
      // Remove the product if it already exists to prevent duplicates
      const filtered = prev.filter((p) => p._id !== product._id);

      // Add the new product to the front of the array and limit the size
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);

      // Save back to local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return updated;
    });
  }, []);

  // Clear the list
  const clearRecentlyViewed = () => {
    localStorage.removeItem(STORAGE_KEY);
    setViewedProducts([]);
  };

  return { viewedProducts, addProduct, clearRecentlyViewed };
}
