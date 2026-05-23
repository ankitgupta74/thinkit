import {
  useEffect,
  useState
} from "react";
import { dummyProducts } from "@/public/assets";
import { Product } from "@/types";

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

  // Total pages for pagination
  const [totalPages, setTotalPages] = useState(1);

  // Loading state for API/data fetching
  const [loading, setLoading] = useState(true);

  // Runs whenever filters change
  // Data pipeline: URL state changes → process products → update UI
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);

      // Create copy before sorting.
      // sort() mutates arrays directly.
      let filteredProducts = [...dummyProducts];

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

      setTotalProducts(totalFilteredProducts);

      setTotalPages(Math.ceil(totalFilteredProducts / itemsPerPage));

      // Pagination stage: calculate visible slice for current page
      const start = (page - 1) * itemsPerPage;

      filteredProducts = filteredProducts.slice(start, start + itemsPerPage);

      setProducts(filteredProducts);

      setLoading(false);
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
  };
}

export default useProducts;
