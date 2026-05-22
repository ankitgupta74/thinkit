import {
  CartItem,
  Product
} from "@/types";

export const addItemToCart = (
  prev: CartItem[],
  product: Product,
  quantity = 1,
) => {
  // Check whether product already exists in cart.
  // find() stops at first match and returns that item.
  const existing = prev.find((item) => item.product._id === product._id);

  // Product already exists → increase quantity instead of creating duplicate item.
  // Never mutate React state directly.
  if (existing) {
    // map() creates a new array.
    return prev.map((item) =>
      item.product._id === product._id
        ? {
            ...item,
            quantity: item.quantity + quantity,
          }
        : item,
    );
  }

  // Product not found → keep old items and append new item.
  return [...prev, { product, quantity }];
};

// filter() keeps only items that pass condition.
// Here we remove the matching product by excluding its id.
export const removeFromCart = (items: CartItem[], productId: string) => {
  return items.filter((item) => item.product._id !== productId);
};

// Central place to control quantity changes.
// Useful for + / - buttons and cart page edits.
export const updateQuantity = (
  items: CartItem[],
  productId: string,
  quantity: number,
) => {
  // Quantity should never be zero or negative.
  // Remove item instead of keeping invalid state.
  if (quantity <= 0) {
    return removeFromCart(items, productId);
  }
  // Replace only the matching item and keep others unchanged.
  return items.map((item) =>
    item.product._id === productId
      ? {
          ...item,
          quantity,
        }
      : item,
  );
};

// Reset cart back to initial state.
export const clearCart = (): CartItem[] => {
  // Empty array = no items in cart.
  return [];
};

// reduce() converts many values into one final value.
// Sum total quantity across all cart items.
export const cartCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

// Calculate final cart value:
// price × quantity for every item, then sum everything.
export const cartTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
