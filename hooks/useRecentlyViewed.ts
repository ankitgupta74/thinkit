import { useCallback, useState, useEffect, useRef, } from "react";
import type { Product } from "@/types";
import { useAuth } from "@/context/auth/useAuth";

const BASE_KEY = "thinkit_recently_viewed_";
const GUEST_KEY = BASE_KEY + "guest";
const MAX_ITEMS = 6;
const CLEAR_EVENT = "thinkit:recently-viewed-clear";

export function useRecentlyViewed() {
  const { user } = useAuth();

  const previousUserId = useRef<string | undefined>(undefined);
  const guestDisabled = useRef(false);
  const recentlyViewedCleared = useRef(false);

  const storageKey = BASE_KEY + (user?._id || "guest");

  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);

  // Load data and handle Guest -> User Migration
  useEffect(() => {
    if (typeof window === "undefined") return;

    const wasLoggedIn = !!previousUserId.current;
    const isLoggedOut = wasLoggedIn && !user?._id;

    if (isLoggedOut) {
      sessionStorage.removeItem(GUEST_KEY);
      guestDisabled.current = true;
      setViewedProducts([]);
    }

    if (user?._id) {
      guestDisabled.current = false;
    }

    previousUserId.current = user?._id;

    // MIGRATION LOGIC: If a user is logged in, check for leftover guest data
    if (user?._id) {
      const guestKey = GUEST_KEY;
      const guestDataStr = sessionStorage.getItem(guestKey);

      if (guestDataStr) {
        try {
          const guestData: Product[] = JSON.parse(guestDataStr);
          const userDataStr = localStorage.getItem(storageKey);
          const userData: Product[] = userDataStr
            ? JSON.parse(userDataStr)
            : [];

          // Merge guest data with user data, removing duplicates, and limit to MAX_ITEMS
          const merged = [...guestData, ...userData];
          const uniqueMerged = merged
            .filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i)
            .slice(0, MAX_ITEMS);

          // Save the merged data to the user's account and destroy the guest data
          localStorage.setItem(storageKey, JSON.stringify(uniqueMerged));
          sessionStorage.removeItem(guestKey);
        } catch (error) {
          console.error("Failed to migrate guest recently viewed data", error);
        }
      }
    }

    // STANDARD LOAD: Read the current key's data into state
    const loadRecentlyViewed = async () => {
      const storage = user?._id ? localStorage : sessionStorage;
      const stored = storage.getItem(storageKey);
      let products: Product[] = [];

      if (stored) {
        try {
          products = JSON.parse(stored);
        } catch (error) {
          console.error(
            "Failed to parse recently viewed products from localStorage",
            error,
          );
        }
      }

      // Defer the state update until after the effect's synchronous execution.
      await Promise.resolve();

      setViewedProducts(products);
    };

    loadRecentlyViewed();

    const handleClear = () => {
      setViewedProducts([]);
    };

    window.addEventListener(CLEAR_EVENT, handleClear);

    return () => {
      window.removeEventListener(CLEAR_EVENT, handleClear);
    };

  }, [storageKey, user?._id]); // Re-run whenever the user logs in or out

  // Add a product to the list
  const addProduct = useCallback(
    (product: Product) => {
      if (typeof window === "undefined") return;

      if (!user?._id && guestDisabled.current) return;
      if (recentlyViewedCleared.current) {
        recentlyViewedCleared.current = false;
      }

      setViewedProducts((prev) => {
        // Remove the product if it already exists to prevent duplicates
        const filtered = prev.filter((p) => p._id !== product._id);

        // Add the new product to the front of the array and limit the size
        const updated = [product, ...filtered].slice(0, MAX_ITEMS);

        // Save back to local storage using the dynamic key
        const storage = user?._id ? localStorage : sessionStorage;

        storage.setItem(storageKey, JSON.stringify(updated));

        return updated;
      });
    },
    [storageKey, user?._id],
  );

  // Clear the list
  const clearRecentlyViewed = () => {
    const storage = user?._id ? localStorage : sessionStorage;

    storage.removeItem(storageKey);
    recentlyViewedCleared.current = true;
    setViewedProducts([]);

    window.dispatchEvent(new Event(CLEAR_EVENT));
  };

  return {
    viewedProducts,
    addProduct,
    clearRecentlyViewed
  };
}
