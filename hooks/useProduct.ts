// Product Data Flow:
//
// Products API
// → Filter
// → Sort
// → Paginate
// → Return Ready-To-Render Data

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

// Hook receives UI state only.
// Hook decides how products should be transformed.
interface Props {
  category: string;
  organic: string;
  sort: string;
  page: number;
  minPrice: string;
  maxPrice: string;
  itemsPerPage: number;
}

function useProducts({
  category,
  organic,
  sort,
  page,
  minPrice,
  maxPrice,
  itemsPerPage,
}: Props) {
  // Final products after: filtering → sorting → pagination
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [error, setError] = useState("");

  // Total pages for pagination
  const [totalPages, setTotalPages] = useState(1);

  // Loading state for API/data fetching
  const [loading, setLoading] = useState(true);

  // Runs whenever filters change
  // Data pipeline: URL state changes → process products → update UI
  useEffect(() => {
    // Fetch products and apply filtering, sorting and pagination.
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Load latest product catalog through the shared API helper.
        // Shared helper adds the /api prefix and gives one common error-handling pattern.
        const data = await api<{
          success: boolean;
          products: Product[];
        }>("/products");

        // Start with all products before applying filters.
        let filteredProducts = [...data.products];

        // keep products matching selected category
        if (category) {
          filteredProducts = filteredProducts.filter(
            (product) => product.category === category,
          );
        }

        // optional product attribute filtering
        if (organic === "true") {
          filteredProducts = filteredProducts.filter(
            (product) => product.isOrganic === true,
          );
        }

        // range filtering pattern (min/max)
        if (minPrice) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price >= Number(minPrice),
          );
        }

        if (maxPrice) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price <= Number(maxPrice),
          );
        }

        // Sort stage: same dataset, different ordering rules
        switch (sort) {
          case "default":
            break;

          case "price_ascending":
            filteredProducts.sort((a, b) => a.price - b.price);
            break;

          case "price_descending":
            filteredProducts.sort((a, b) => b.price - a.price);
            break;

          case "rating":
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;

          case "name":
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        }

        // Count before pagination.
        // UI should show total matches, not current page length.
        const totalFilteredProducts = filteredProducts.length;

        // Calculate how many pages are needed for current results.
        setTotalProducts(totalFilteredProducts);

        setTotalPages(Math.ceil(totalFilteredProducts / itemsPerPage));

        // Pagination stage: calculate visible slice for current page
        const start = (page - 1) * itemsPerPage;

        filteredProducts = filteredProducts.slice(start, start + itemsPerPage);

        setProducts(filteredProducts);

        setLoading(false);
      } catch (error) {
        // If the request fails, clear old products so the UI does not show stale results.
        console.error(error);

        setError("Failed to load products");

        // Keep UI stable if API request fails.
        setProducts([]);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load products. Please try again.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [category, organic, sort, itemsPerPage, page, minPrice, maxPrice]);

  // Hook exposes processed data only.
  // Components should not know transformation details.
  return {
    products,
    totalProducts,
    totalPages,
    loading,
    error,
  };
}

export default useProducts;
