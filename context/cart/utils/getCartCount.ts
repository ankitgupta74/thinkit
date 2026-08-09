import { CartItem } from "@/types";

// Counts total product units in the cart.
export function getCartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}