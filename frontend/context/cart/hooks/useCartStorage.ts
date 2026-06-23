"use client";

import type { CartItem } from "@/types";
import { useEffect, useState } from "react";

// One fixed key keeps this app's cart separate from other localStorage data.
const CART_STORAGE_KEY = "app_cart";

// Reads the saved guest cart safely from browser storage.
function getStoredCart(): CartItem[] {
  // localStorage is available only in the browser.
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    // No saved cart means customer starts with an empty cart.
    if (!savedCart) {
      return [];
    }

    const parsedCart: unknown = JSON.parse(savedCart);

    // Only accept array-shaped saved data.
    return Array.isArray(parsedCart) ? (parsedCart as CartItem[]) : [];
  } catch {
    // Broken or outdated storage should not crash the application.
    window.localStorage.removeItem(CART_STORAGE_KEY);

    return [];
  }
}

export function useCartStorage() {
  // Restore saved guest cart once when the provider first mounts.
  const [items, setItems] = useState<CartItem[]>(getStoredCart);

  // Keep browser storage synchronized with React cart state.
  // Save after every cart change so items remain after page refresh.
  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  return {
    items,
    setItems,
  };
}
