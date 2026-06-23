"use client";

import { useContext } from "react";
import CartContext from "./cartContext";

// Gives components access to the nearest CartProvider.
export function useCart() {
  const context = useContext(CartContext);

  // Prevent cart usage outside the provider tree.
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
