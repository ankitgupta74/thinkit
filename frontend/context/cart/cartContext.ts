import { createContext } from "react";
import type { CartContextType } from "./types/cart.types";

// Shared cart container used by CartProvider and useCart().
const CartContext = createContext<CartContextType | undefined>(undefined);

export default CartContext;
