"use client";

import type { ReactNode } from "react";

import WishlistContext from "./wishlistContext";
import { useWishlist as useWishlistHook } from "@/hooks/useWishlist";

interface WishlistProviderProps {
  children: ReactNode;
}

// Provides wishlist state and actions to the full application.
export function WishlistProvider({ children }: WishlistProviderProps) {
  const wishlist = useWishlistHook();

  return (
    // Share one cart source with every component inside this provider.
    <WishlistContext.Provider value={wishlist}>
      {children}
    </WishlistContext.Provider>
  );
}
