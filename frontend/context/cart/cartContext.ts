import { createContext } from "react";    // Creates shared storage.
import CartContextType from "./types/cart.types";

// Creating Context
const cartContext = createContext<CartContextType | undefined>(undefined);

export default cartContext;
