import type { CartItem, Product } from "@/types";

// Defines every cart value and action available through CartContext.
export interface CartContextType {
  // Products currently stored in the customer cart.
  items: CartItem[];

  // Adds a product or increases quantity if it already exists.
  addToCart: (product: Product, quantity?: number) => void;

  // Removes one product completely from the cart.
  removeFromCart: (productId: string) => void;

  // Changes quantity for an existing cart item.
  updateQuantity: (productId: string, quantity: number) => void;

  // Removes all products from the cart.
  clearCart: () => void;

  // Total number of units across all cart items.
  cartCount: number;

  // Combined price of every cart item.
  cartTotal: number;

  // Controls cart sidebar visibility.
  isCartOpen: boolean;

  // Opens or closes the cart sidebar.
  setIsCartOpen: (open: boolean) => void;
}
