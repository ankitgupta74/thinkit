import {
  CartItem,
  Product
} from "@/types";

interface CartContextType {       // Defines What should the context provide?
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export default CartContextType;
