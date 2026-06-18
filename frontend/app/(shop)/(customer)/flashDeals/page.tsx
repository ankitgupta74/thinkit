"use client";

import ProductCard from "@/components/product/ProductCard";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import usePagination from "@/hooks/usePagination";
import { Product } from "@/types";
import { Zap } from "lucide-react";
import {
  useEffect,
  useState
} from "react";
import {
  useSearchParams,
  useRouter,
  usePathname
} from "next/navigation";

function FlashDeals() {
  // URL can store page/filter info.
  // Makes state shareable and refresh-safe.
  const searchParams = useSearchParams();

  const router = useRouter();

  const pathname = usePathname();

  // Read current page from URL.
  // Fallback to page 1 if nothing exists.
  const page = Number(searchParams.get("page")) || 1;

  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);

  const [error, setError] = useState("");

  // If data can be calculated, avoid extra state.
  // useMemo prevents unnecessary recalculation.


  // Custom hook handles pagination logic.
  // Component only consumes final results.
  const { paginatedItems, totalPages } = usePagination({
    items: products,
    page,
    itemsPerPage: 10,
  });

  // Simulate loading behavior.
  // Later replace with real API fetching.
  useEffect(() => {
    // Load latest products from backend and extract active flash deals.
    const loadDeals = async () => {
      try {
        setLoading(true);

        // Fetch product catalog from API.
        const response = await fetch("/api/products");

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to load deals");
        }

        // Only show discounted products that are still available.
        const flashDeals = data.products.filter(
          (product: Product) => product.discount > 0 && product.stock > 0,
        );

        setProducts(flashDeals);
      } catch (error) {
        console.error(error);

        setError("Failed to load deals");
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, []);

  // Update page in URL.
  // Same pattern can work for filters/sorting too.
  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", String(page));

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });

    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-app-cream">
      {/* Banner */}
      <div className="bg-linear-to-r from-app-orange to-app-orange-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex-center gap-2 mb-3">
            <Zap className="size-6 fill-white" />
            <h1 className="text-3xl font-semibold">Flash Deals</h1>
            <Zap className="size-6 fill-white" />
          </div>
          <p className="text-white/80 max-w-md mx-auto">
            Limited-time offers on your favorite organic products. Grab them
            before they&apos;re gone!
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-8">
        {error ? (
          <div className="text-center py-16">
            <p className="text-red-500">{error}</p>
          </div>
        ) : loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Zap className="size-16 text-app-border mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-app-green mb-2">
              No deals right now
            </h2>
            <p className="text-sm text-app-text-light">
              Check back soon for amazing offers!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Render only products for current page */}
              {paginatedItems.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={updatePage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default FlashDeals;
