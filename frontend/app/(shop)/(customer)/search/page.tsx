"use client";

import ProductCard from "@/components/product/ProductCard";
import Loader from "@/components/ui/Loader";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import { Home, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useState
} from "react";
import toast from "react-hot-toast";

function SearchContent() {
  const searchParams = useSearchParams();

  // Search term comes from the URL so results can be shared and bookmarked.
  const query = searchParams.get("q") || "";
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

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link href="/" className="hover:text-app-green transition-colors">
            <Home className="size-4" />
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium">Search Results</span>
        </nav>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-app-green mb-1">
            Results for &quot;{query}&quot;
          </h1>
          <p>{`${products.length} items found`}</p>
        </div>
        {/* Results */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <SearchIcon className="size-16 text-app-border mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-app-green mb-2">
              No results found
            </h2>
            <p className="text-sm text-app-text-light mb-6 max-w-md mx-auto">
              We couldn&apos;t find any products matching &quot;{query}&quot;.
              Try a different search term.
            </p>
            <Link
              href="/products"
              className="inline-flex px-5 py-2.5 bg-app-green text-white text-sm font-medium rounded-lg"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Search() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchContent />
    </Suspense>
  );
}

export default Search;
