import { CartItem } from "@/types";

// Removes one product completely from the cart.
export function removeFromCart(
  items: CartItem[],
  productId: string,
): CartItem[] {
  return items.filter((item) => item.product._id !== productId);
}