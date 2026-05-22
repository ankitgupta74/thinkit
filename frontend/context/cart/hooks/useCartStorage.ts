"use client";

import { CartItem } from "@/types";
import {
  useEffect, // Runs side effects.
  useState, // Stores state.
} from "react";

export function useCartStorage() {
  // Lazy Initialization - useState(()=>{}) - React runs function only once
  const [items, setItems] = useState<CartItem[]>(() => {
    // Next.js may render on server first.
    // localStorage exists only in browser, so prevent server crash.
    if (typeof window === "undefined") {
      return [];
    }

    // Try restoring previously saved cart from browser storage.
    const saved = localStorage.getItem("app_cart");

    // localStorage stores strings only.
    // Convert JSON string → JS object, otherwise start with empty cart.
    return saved ? JSON.parse(saved) : [];
  });

  // Keep browser storage synced whenever cart state changes.
  useEffect(() => {
    localStorage.setItem("app_cart", JSON.stringify(items));
  }, [items]); // Whenever items changes... React runs: localStorage.setItem()

  return {
    items,
    setItems,
  };
}
