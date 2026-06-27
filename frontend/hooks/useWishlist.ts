import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { WishlistItem } from "@/types";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load the current customer's wishlist.
  const loadWishlist = async () => {
    const data = await api<{
      success: boolean;
      wishlist: WishlistItem[];
    }>("/wishlist");

    setWishlist(data.wishlist);
  };

  const getProductId = (item: WishlistItem) =>
    typeof item.product === "string" ? item.product : item.product._id;

  // Check whether a product already exists in the customer's wishlist.
  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => {
      return getProductId(item) === productId;
    });
  };

  // Add a product to the customer's wishlist.
  const addToWishlist = async (productId: string) => {
    try {
      const data = await api<{
        success: boolean;
        message: string;
        wishlistItem: WishlistItem;
      }>("/wishlist", {
        method: "POST",
        body: {
          productId,
        },
      });

      // Show newest item first.
      setWishlist((prev) => [data.wishlistItem, ...prev]);

      toast.success(data.message);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add item to wishlist.",
      );
    }
  };

  // Remove a wishlist item.
  const removeFromWishlist = async (wishlistItemId: string) => {
    try {
      const data = await api<{
        success: boolean;
        message: string;
      }>(`/wishlist/${wishlistItemId}`, {
        method: "DELETE",
      });

      setWishlist((prev) => prev.filter((item) => item._id !== wishlistItemId));

      toast.success(data.message);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to remove wishlist item.",
      );
    }
  };

  // Add or remove a product depending on its current wishlist state.
  const toggleWishlist = async (productId: string) => {
    const wishlistItem = wishlist.find((item) => {
      return getProductId(item) === productId;
    });

    if (wishlistItem) {
      await removeFromWishlist(wishlistItem._id);
    } else {
      await addToWishlist(productId);
    }
  };

  useEffect(() => {
    async function initializeWishlist() {
      try {
        await loadWishlist();
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to initialize wishlist. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    initializeWishlist();
  }, []);

  return {
    wishlist,
    loading,

    loadWishlist,

    isWishlisted,

    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };
}