import { createContext } from "react";
import type { WishlistContextType } from "./types/wishlist.types";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export default WishlistContext;
