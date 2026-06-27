import type { WishlistItem } from "@/types";

export interface WishlistContextType {
  wishlist: WishlistItem[];

  loading: boolean;

  loadWishlist: () => Promise<void>;

  isWishlisted: (productId: string) => boolean;

  addToWishlist: (productId: string) => Promise<void>;

  removeFromWishlist: (wishlistItemId: string) => Promise<void>;

  toggleWishlist: (productId: string) => Promise<void>;
}
