import { CartItem } from "@/types";

// Calculates total cart price.
export function getCartTotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
}
