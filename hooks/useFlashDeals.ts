import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Product } from "@/types";
import toast from "react-hot-toast";

export function useFlashDeals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load flash deals from backend when this page opens.
  useEffect(() => {
    // Load latest products from backend and extract active flash deals.
    const loadDeals = async () => {
      try {
        setLoading(true);

        // Fetch product catalog from API.
        // Load flash-deal products through the shared API helper.
        // Shared helper adds the /api prefix and handles failed responses consistently.
        const data = await api<{
          success: boolean;
          products: Product[];
        }>("/products/flashDeals");

        // Only show discounted products that are still available.
        // Backend already returns only active flash-deal products.
        setProducts(data.products);
      } catch (error: unknown) {
        // api() throws the backend message, which we show through the toast.
        console.error(error);

        setError("Failed to load deals");

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load flash deals. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, []);

  return { products, loading, error };
}
