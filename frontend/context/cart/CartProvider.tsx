"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { Product } from "@/types";

import CartContext from "./cartContext";
import { useCartStorage } from "./hooks/useCartStorage";
import {
  addItemToCart,
  clearCart,
  getCartCount,
  getCartTotal,
  removeFromCart,
  updateQuantity,
} from "./utils/cartHelpers";

interface CartProviderProps {
  children: ReactNode;
}

// Provides cart state and cart actions to the full application.
export function CartProvider({ children }: CartProviderProps) {
  // Controls whether the cart sidebar is visible.
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Stores cart items in React state and browser localStorage.
  const { items, setItems } = useCartStorage();

  // Adds a product and opens the cart sidebar for immediate feedback.
  const addToCart = (product: Product, quantity = 1) => {
    // Use previous state because cart updates depend on the latest cart contents.
    setItems((previousItems) =>
      addItemToCart(previousItems, product, quantity),
    );

    setIsCartOpen(true);
  };

  // Removes one product from the cart.
  const removeItem = (productId: string) => {
    setItems((previousItems) => removeFromCart(previousItems, productId));
  };

  // Updates one product quantity.
  const updateItemQuantity = (productId: string, quantity: number) => {
    setItems((previousItems) =>
      updateQuantity(previousItems, productId, quantity),
    );
  };

  // Clears cart items and closes the sidebar.
  const clear = () => {
    setItems(clearCart());
    setIsCartOpen(false);
  };

  // Recalculate derived values only when cart items change.
  const cartCount = useMemo(() => getCartCount(items), [items]);

  // Total changes only when items change, so memo avoids recalculating on sidebar-only updates.
  const cartTotal = useMemo(() => getCartTotal(items), [items]);

  return (
    // Share one cart source with every component inside this provider.
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart: removeItem,
        updateQuantity: updateItemQuantity,
        clearCart: clear,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
