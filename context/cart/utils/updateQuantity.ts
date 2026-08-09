import { CartItem } from "@/types";
import { removeFromCart } from "./removeFromCart";

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