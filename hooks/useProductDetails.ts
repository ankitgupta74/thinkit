// Product Page Flow:
//
// Product ID From URL
// → Fetch Product
// → Fetch Related Products
// → Sync Cart State
// → Render Product Details

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export function useProductDetails(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Reload page data whenever the product ID in the URL changes.
  useEffect(() => {
    // Load product details and related products.
    async function loadProduct() {
      try {
        // Fetch selected product from backend.
        // Load selected product through the shared API helper.
        // Shared helper requests one product and returns typed response data.
        const productData = await api<{
          success: boolean;
          product: Product;
        }>(`/products/${id}`);

        const currentProduct = productData.product;

        setProduct(currentProduct);

        // Load catalog through the same API helper to find related products.
        // Load the catalog once so this page can build related products locally.
        const productsData = await api<{
          success: boolean;
          products: Product[];
        }>("/products");

        // Show products from the same category except the current one.
        const related = productsData.products.filter(
          (p: Product) =>
            p.category === currentProduct.category &&
            p._id !== currentProduct._id,
        );

        setRelatedProducts(related);
      } catch (error: unknown) {
        // Keep the page stable and show the API error instead of crashing.
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load product. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    // Wait until route parameter becomes available.
    // Do not call the API until Next.js provides the dynamic route ID.
    if (id) {
      loadProduct();
    }
  }, [id]);

  return { product, relatedProducts, loading };
}
