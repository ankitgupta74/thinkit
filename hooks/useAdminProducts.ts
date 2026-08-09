import { useState, useEffect } from "react";
import type { Product } from "@/types";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all products for admin management.
    const fetchProducts = async () => {
      try {
        // Fetch latest products from backend.
        const data = await api<{
          success: boolean;
          products: Product[];
        }>("/products");

        setProducts(data.products);
      } catch (error) {
        console.error(error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load products. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Quick stock management action.
  const handleMarkOutOfStock = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to mark "${name}" as out of stock?`,
      )
    ) {
      return;
    }

    try {
      // Find current product data before updating stock.
      const product = products.find((p) => p._id === id);

      if (!product) return;

      // Reuse update endpoint and set stock to zero.
      await api(`/products/${id}`, {
        method: "PUT",
        body: {
          ...product,
          stock: 0,
        },
      });

      // Update UI immediately after successful change.
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, stock: 0 } : p)),
      );

      toast.success("Marked out of stock");
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Mark out of Stock failed. Please try again.";

      toast.error(message);
    }
  };

  return { products, loading, handleMarkOutOfStock };
}
