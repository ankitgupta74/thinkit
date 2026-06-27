"use client";

import Loader from "@/components/ui/Loader";
import { useWishlist } from "@/context/wishlist/useWishlist";
import { useCart } from "@/context/cart/useCart";
import {
  HeartIcon,
  HomeIcon,
  ArrowRightIcon,
  Trash2Icon,
  PackageX
} from "lucide-react";
import { Product, WishlistItem } from "@/types";
import Link from "next/link";
import WishlistCard from "@/components/wishlist/WishlistCard";

type UnavailableWishlistItem = WishlistItem & {
  product: string;
};

function Wishlist() {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (
    item: WishlistItem & {
      product: Product;
    },
  ) => {
    addToCart(item.product);

    await removeFromWishlist(item._id);
  };

  const availableItems = wishlist.filter(
    (
      item,
    ): item is WishlistItem & {
      product: Product;
    } => typeof item.product !== "string",
  );

  const unavailableItems = wishlist.filter(
    (item): item is UnavailableWishlistItem => typeof item.product === "string",
  );

  if (loading) {
    return <Loader />;
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-app-cream py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/50 rounded-2xl min-h-[60vh] flex flex-col justify-center items-center py-20 px-4">
            <HeartIcon className="size-16 text-app-border mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-app-green mb-2">
              Your wishlist is empty
            </h1>
            <p className="text-sm text-app-text-light mb-6 text-center max-w-md">
              Save your favorite products here to quickly find them later.
            </p>
            <Link
              href="/products"
              className="inline-flex px-5 py-2.5 bg-app-green text-white text-sm font-medium rounded-xl hover:bg-app-green-dark transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link href="/" className="hover:text-app-green transition-colors">
            <HomeIcon className="size-4" />
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium">My Wishlist</span>
        </nav>

        {/* Header & Continue Shopping */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-app-green">
              My Wishlist
            </h1>
            <p className="text-sm text-app-text-light mt-1">
              {availableItems.length} saved item
              {availableItems.length !== 1 && "s"}
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors pb-1 shrink-0"
          >
            Continue Shopping <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {/* Available Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-8">
          {availableItems.map((item) => (
            <WishlistCard
              key={item._id}
              item={item}
              onMoveToCart={() => handleMoveToCart(item)}
              onRemove={() => removeFromWishlist(item._id)}
            />
          ))}
        </div>

        {/* Unavailable Products Section */}
        {unavailableItems.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl border border-dashed border-app-border bg-white/40 p-4 flex flex-row items-center justify-between gap-4 transition-colors hover:bg-white/60"
          >
            {/* Added an icon wrapper for visual balance */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gray-100 flex-center shrink-0">
                <PackageX className="size-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-700 text-sm">
                  Product Unavailable
                </h3>
                <p className="text-xs text-app-text-light mt-0.5 line-clamp-1">
                  Ref: {item.product}
                </p>
              </div>
            </div>

            {/* Phase 2: Direct Removal for unavailable items */}
            <button
              type="button"
              onClick={() => removeFromWishlist(item._id)}
              className="p-2 text-gray-400 bg-white hover:bg-red-50 hover:text-red-500 border border-gray-100 hover:border-red-100 rounded-xl transition-all shrink-0 flex items-center gap-2 text-sm font-medium"
            >
              <Trash2Icon className="size-4" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
