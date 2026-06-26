import { CartItem, Product } from "@/types";

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