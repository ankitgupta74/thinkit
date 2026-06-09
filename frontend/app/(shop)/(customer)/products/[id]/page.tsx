"use client";

import { useCart } from "@/context/cart/useCart";
import { dummyProducts } from "@/public/assets";
import DummyReviewsSection from "@/components/ui/DummyReviewsSection";
import type { Product } from "@/types";
import { CURRENCY } from "@/utils/config";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  LeafIcon,
  Loader,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";

function Product() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  // Small temporary quantity state.
  // Used before product enters cart.
  // After adding to cart, cart becomes the main source of truth.
  const [localQuantity, setLocalQuantity] = useState(1);

  // Match URL id with product id.
  // Example: /products/123 → find product with _id=123
  const product = dummyProducts.find((p) => p._id === id) || null;

  // Show products from same category, but avoid showing current product again.
  const relatedProducts = product
    ? dummyProducts.filter(
        (p) => p._id !== id && p.category === product.category,
      )
    : [];

  // Safety check.
  // Prevent page crash if product id is missing or invalid.
  if (!product) return <Loader />;

  // Check if this product already exists inside cart
  const cartItem = items.find((item) => item.product._id === product._id);

  // Convert value into true/false
  const inCart = !!cartItem;

  // If product exists in cart, show cart quantity. Otherwise use temporary local quantity.
  const displayQuantity = inCart ? cartItem.quantity : localQuantity;

  // Convert machine text into readable text. Example: fresh-fruits → fresh fruits
  const categoryLabel = product.category.replace(/-/g, " ");

  // Quantity decrease logic:
  // If product is already in cart → update cart data
  // If quantity becomes 0 → remove item
  // If product not in cart → update local state only
  const handleMinus = () => {
    if (inCart) {
      if (cartItem.quantity > 1)
        updateQuantity(product._id, cartItem.quantity - 1);
      else removeFromCart(product._id);
    } else {
      setLocalQuantity(Math.max(1, localQuantity - 1));
    }
  };

  // Quantity increase follows same rule:
  // Cart item → update cart quantity
  // Not in cart → update temporary state
  const handlePlus = () => {
    if (inCart) updateQuantity(product._id, cartItem.quantity + 1);
    else setLocalQuantity(localQuantity + 1);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link href="/" className="hover:text-app-green transition-colors">
            <HomeIcon className="size-4" />
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-app-green transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-app-green transition-colors capitalize"
          >
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium truncate max-w-50">
            {product.name}
          </span>
        </nav>
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 mb-6 text-sm text-app-text-light hover:text-app-green transition-colors"
        >
          <ArrowLeftIcon className="size-4" /> Back
        </button>
        {/* Product Details Section */}
        <div className="bg-white/50 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Image */}
            <div className="relative flex-center p-8 md:p-12 min-h-80 md:min-h-120">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                loading="eager"
                className="max-h-90 w-auto object-contain"
              />
              {/* Badge */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
                {product.isOrganic && (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-app-green text-white rounded-full">
                    <LeafIcon className="w-3 h-3" /> Organic
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="px-2.5 py-1 text-xs font-semibold bg-app-orange text-white rounded-full">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            {/* Right Side - Details */}
            <div className="p-6 md:p-10 flex flex-col justify-center">
              <span className="text-xs font-medium text-app-text-light tracking-wider mb-2 capitalize">
                {categoryLabel}
              </span>
              <h1 className="text-2xl md:text-3xl font-semibold text-app-green mb-3">
                {product.name}
              </h1>
              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-0.5">
                    {/* Create 5 stars and fill only required amount */}
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(product.rating) ? "text-app-warning fill-app-warning" : "text-app-border"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-app-text-light">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              )}
              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl md:text-4xl font-semibold text-app-green">
                  {CURRENCY} {product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-app-text-light line-through">
                    {CURRENCY}
                    {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {/* Description */}
              <p className="text-sm text-app-text-light leading-relaxed mb-6">
                {product.description}
              </p>
              {/* Stock */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="text-sm text-app-success font-medium">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-sm text-app-error font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-app-border rounded-xl overflow-hidden">
                  <button
                    type="button"
                    aria-label="Decrease Product Quantity"
                    onClick={handleMinus}
                    className="p-3 hover:bg-app-cream transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-5 text-sm font-semibold min-w-10 text-center">
                    {displayQuantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase Product Quantity"
                    onClick={handlePlus}
                    className="p-3 hover:bg-app-cream transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                {/* Add to Cart */}
                <button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={() => {
                    // Prevent duplicate add action.
                    // Existing cart item already handles quantity separately.
                    if (!inCart) addToCart(product, localQuantity);
                  }}
                  className={`flex-1 py-3 font-semibold rounded-xl transition-colors flex-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${inCart ? "bg-app-cream text-app-green border border-app-green" : "bg-app-orange text-white hover:bg-app-orange-dark"}`}
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  {inCart ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Customer Reviews Section */}
        {product.reviewCount > 0 && <DummyReviewsSection product={product} />}
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 mb-44">
            <div className="flex items-center justify-between mb-6">
              <div className="">
                <h2 className="text-2xl font-semibold text-app-green">
                  Related Products
                </h2>
                <p className="text-sm text-app-text-light mt-1">
                  More from {categoryLabel}
                </p>
              </div>
              <Link
                href={`/products?category=${product.category}`}
                className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors"
              >
                View All <ArrowRightIcon className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
              {relatedProducts.slice(0, 5).map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Product;
