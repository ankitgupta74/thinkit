// Data Flow:
//
// URL Filters
// → useProducts()
// → Products API
// → Filter / Sort / Paginate
// → Render Product Grid

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export function useSearch(query: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Re-run search whenever the query changes.
  // Run a fresh search whenever the URL query changes.
  useEffect(() => {
    // Load products and perform client-side search filtering.
    const searchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch latest product catalog.
        // Fetch latest product catalog through the shared API helper.
        // Shared helper fetches the latest catalog and handles API errors consistently.
        const data = await api<{
          success: boolean;
          products: Product[];
        }>("/products");

        // Match products whose names contain the search text.
        // Current search is client-side: fetch catalog first, then match product names.
        const filteredProducts = query
          ? data.products.filter((product: Product) =>
              product.name.toLowerCase().includes(query.toLowerCase()),
            )
          : [];

        setProducts(filteredProducts);
      } catch (error) {
        // Clear old results if the latest API request fails.
        console.error(error);

        setError("Failed to search products");

        setProducts([]);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to search product. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();

    // Search again when URL query changes.
  }, [query]);

  return { products, loading, error };
}
