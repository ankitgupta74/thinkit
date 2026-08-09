"use client";

import type { CartItem } from "@/types";
import { useEffect, useState } from "react";
import { getStoredCart } from "../utils/getStoredCart";

// One fixed key keeps this app's cart separate from other localStorage data.
const CART_STORAGE_KEY = "app_cart";

export function useCartStorage() {
  // Initialize with an empty array to match the server-rendered HTML.
  const [items, setItems] = useState<CartItem[]>([]);

  // Track whether the cart has loaded from storage to prevent accidental overwrites.
  const [isLoaded, setIsLoaded] = useState(false);

  // Load the saved cart AFTER the component mounts (client-side only).
  useEffect(() => {
    const initializeCart = async () => {
      const storedItems = getStoredCart(CART_STORAGE_KEY);
      setItems(storedItems);
      setIsLoaded(true);
    };

    initializeCart();
  }, []);

  // Save to localStorage whenever items change, but ONLY after the initial load is complete.
  useEffect(() => {
    if (isLoaded) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  return {
    items,
    setItems,
    isLoaded, // Useful if you want to show a loading spinner in the UI while checking the cart
  };
}
