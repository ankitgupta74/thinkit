"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cart/useCart";
import { useWishlist } from "@/context/wishlist/useWishlist";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import Loader from "@/components/ui/Loader";
import DummyReviewsSection from "@/components/ui/DummyReviewsSection";
import RecentlyViewedSection from "@/components/product/RecentlyViewedSection";
import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import ProductImageSection from "@/components/product/ProductImageSection";
import ProductQuantityControl from "@/components/product/ProductQuantityControl";
import ProductActions from "@/components/product/ProductActions";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProductsSection from "@/components/product/RelatedProductsSection";

function Product() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const [localQuantity, setLocalQuantity] = useState(1);

  const { product, relatedProducts, loading } = useProductDetails(id);
  const { addProduct } = useRecentlyViewed();

  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (product) {
      addProduct(product);
    }
  }, [product, addProduct]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return <Loader />;
  }

  const wishlisted = isWishlisted(product._id);

  const cartItem = items.find((item) => item.product._id === product._id);

  const inCart = !!cartItem;

  const displayQuantity = inCart ? cartItem.quantity : localQuantity;
  const isMinusDisabled = product.stock <= 0 || (!inCart && localQuantity <= 1);
  const isPlusDisabled = product.stock <= 0 || displayQuantity >= product.stock;

  const categoryLabel = product.category.replace(/-/g, " ");

  const handleMinus = () => {
    if (inCart) {
      if (cartItem.quantity > 1)
        updateQuantity(product._id, cartItem.quantity - 1);
      else removeFromCart(product._id);
    } else {
      setLocalQuantity(Math.max(1, localQuantity - 1));
    }
  };

  const handlePlus = () => {
    if (inCart) updateQuantity(product._id, cartItem.quantity + 1);
    else setLocalQuantity(localQuantity + 1);
  };

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          filter: "blur(4px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >

        {/* Breadcrumbs */}
        <ProductBreadcrumbs
          category={product.category}
          categoryLabel={categoryLabel}
          productName={product.name}
        />

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
            <ProductImageSection
              image={product.image}
              name={product.name}
              isOrganic={product.isOrganic}
              discount={product.discount}
            />

            {/* Right Side - Details */}
            <div className="p-6 md:p-10 flex flex-col justify-center">
              <ProductInfo product={product} categoryLabel={categoryLabel} />

              {/* Quantity + Add to Cart */}
              <motion.div
                whileHover={{ y: -2 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
                className="relative flex items-center gap-3"
              >
                <ProductQuantityControl
                  displayQuantity={displayQuantity}
                  isMinusDisabled={isMinusDisabled}
                  isPlusDisabled={isPlusDisabled}
                  inCart={inCart}
                  cartQuantity={cartItem?.quantity}
                  stock={product.stock}
                  onMinus={handleMinus}
                  onPlus={handlePlus}
                />
                <ProductActions
                  product={product}
                  wishlisted={wishlisted}
                  inCart={inCart}
                  cartQuantity={cartItem?.quantity ?? 0}
                  displayQuantity={displayQuantity}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={addToCart}
                  onGoToCart={() => router.push("/cart")}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        {product.reviewCount > 0 && <DummyReviewsSection product={product} />}

        {/* Related Products Section */}
        <RelatedProductsSection
          products={relatedProducts}
          category={product.category}
          categoryLabel={categoryLabel}
        />

        {/* Recently Viewed Section */}
        <RecentlyViewedSection currentProductId={product._id} />
      </motion.div>
    </div>
  );
}

export default Product;
