import type { CartItem, Product } from "@/types";

// Adds a new product or increases quantity for an existing product.
export function addItemToCart(
  items: CartItem[],
  product: Product,
  quantity = 1,
): CartItem[] {
  // Ignore invalid add requests.
  if (quantity <= 0) {
    return items;
  }

  // Check by product ID because the same product should appear only once in the cart.
  const existingItem = items.find((item) => item.product._id === product._id);

  // Existing product: increase its quantity instead of duplicating it.
  if (existingItem) {
    // Return a new array instead of changing old state directly.
    return items.map((item) =>
      item.product._id === product._id
        ? {
            ...item,
            quantity: item.quantity + quantity,
          }
        : item,
    );
  }

  // New product: append it to the cart.
  return [...items, { product, quantity }];
}

// Removes one product completely from the cart.
export function removeFromCart(
  items: CartItem[],
  productId: string,
): CartItem[] {
  return items.filter((item) => item.product._id !== productId);
}

// Updates quantity or removes the product when quantity becomes zero.
export function updateQuantity(
  items: CartItem[],
  productId: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(items, productId);
  }

  return items.map((item) =>
    item.product._id === productId
      ? {
          ...item,
          quantity,
        }
      : item,
  );
}

// Clears all cart items.
export function clearCart(): CartItem[] {
  return [];
}

// Counts total product units in the cart.
export function getCartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

// Calculates total cart price.
export function getCartTotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
}
