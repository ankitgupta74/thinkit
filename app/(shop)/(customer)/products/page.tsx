"use client";

import FilterPanel from "@/components/product/FilterPanel";
import ProductCard from "@/components/product/ProductCard";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import useProducts from "@/hooks/useProduct";
import { categoriesData } from "@/public/assets";
import { FilterKey } from "@/utils/productCategoryKey";
import { useProductFilters } from "@/hooks/useProductFilters";

import {
  ChevronDown,
  HomeIcon,
  SearchX,
  SlidersHorizontal,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";

// Page responsibility:
// Read URL state → coordinate hooks → render UI.
// Heavy business logic stays outside in hooks/helpers.
function ProductsContent() {
  // Controls mobile filter sidebar
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  // Reusable modal pattern: lock page scroll while overlay is open
  useBodyScrollLock(mobileFilterOpen);

  const { filters, hasFilters, updateFilter, clearFilters } =
    useProductFilters();

  const { category, organic, sort, minPrice, maxPrice, page } = filters;

  // Find currently selected category
  // Derived UI state: calculate display label from selected slug
  const activeCategory = useMemo(
    () => categoriesData.find((c) => c.slug === category),
    [category],
  );

  // Product transformation pipeline lives in custom hook: filtering → sorting → pagination
  // Custom hook handles product fetching and transformation logic.
  const { products, totalProducts, totalPages, loading, error } = useProducts({
    ...filters,
    itemsPerPage: 12,
  });

  // Update a single filter in URL
  // Generic updater: same function works for category, sort, pagination, etc.
  // Modify the update/clear wrappers to auto-close the mobile menu
  const handleUpdateFilter = (key: FilterKey, value: string) => {
    updateFilter(key, value);
    setMobileFilterOpen(false);
  };

  // Clears every filter from URL. Example: "/products?category=snacks&minPrice=50" becomes: "/products"
  // Create a fresh empty query object... Empty query = no filters applied
  // Reset product listing back to default state.
  const handleClearFilters = () => {
    clearFilters();
    setMobileFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link href="/" className="hover:text-app-green transition-colors">
            <HomeIcon className="size-4" />
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium">
            {activeCategory ? activeCategory.name : "All Products"}
          </span>
        </nav>
        <div className="flex gap-8 xl:gap-10">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-70 shrink-0">
            <div className="bg-white rounded-2xl p-4 sticky top-24">
              <FilterPanel
                categories={categoriesData}
                category={category}
                organic={organic}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={handleUpdateFilter}
                clearFilters={handleClearFilters}
                hasFilters={hasFilters}
              />
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1">
            {/* /Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="">
                <h1 className="text-2xl font-semibold text-app-green">
                  {activeCategory ? activeCategory.name : "All Products"}
                </h1>
                <p className="text-sm text-app-text-light mt-0.5">
                  {totalProducts} products found
                </p>
              </div>
              <div className="flex flex-col lg:items-center gap-3">
                {/* Mobile filter toggle */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-xl border border-app-border hover:bg-app-cream transition-colors"
                >
                  <SlidersHorizontal className="size-4" /> Filters
                </button>

                {/* Sort */}
                {/* Query-driven controls: changing UI updates URL state */}
                <div className="relative">
                  <label
                    htmlFor="sort"
                    // sr-only = hidden visually but screen readers can read it
                    className="sr-only"
                  >
                    Sort Products
                  </label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm bg-white rounded-xl border border-app-border focus:border-app-green outline-none cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="price_ascending">Price: Low → High</option>

                    <option value="price_descending">Price: High → Low</option>

                    <option value="rating">Top Rated</option>

                    <option value="name">A → Z</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-text-light pointer-events-none" />
                </div>
              </div>
            </div>
            {/* Product Grid */}
            {error ? (
              <div className="text-center py-16">
                <p className="text-red-500">{error}</p>
              </div>
            ) : loading ? (
              <Loader />
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-semibold text-app-green mb-2">
                  <SearchX className="size-16 mx-auto text-gray-300 mb-4" />
                  No products found
                </p>
                <p className="text-sm text-app-text-light mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-5 py-2 text-sm font-medium bg-app-green text-white rounded-xl hover:bg-app-green-light transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-8">
                {products.map(
                  (product, i) =>
                    product.stock > 0 && (
                      <ProductCard
                        key={product._id}
                        product={product}
                        priority={i < 4}
                      />
                    ),
                )}
              </div>
            )}
            {/* URL-driven pagination keeps state shareable and refresh-safe */}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(page) => {
                updateFilter("page", String(page));

                window.scrollTo(0, 0);
              }}
            />
          </main>
        </div>
      </div>
      {/* Mobile Filters Modal */}
      {/* Mobile drawer pattern: overlay + body lock + click outside to close */}
      {mobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setMobileFilterOpen(false)}
          >
            <div
              className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-app-border">
                <h3 className="text-lg font-semibold text-app-green">
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="Close Filter Panel"
                  className="p-2 hover:bg-app-cream rounded-lg"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
              <div className="p-4">
                <FilterPanel
                  categories={categoriesData}
                  category={category}
                  organic={organic}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  updateFilter={handleUpdateFilter}
                  clearFilters={handleClearFilters}
                  hasFilters={hasFilters}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Products() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductsContent />
    </Suspense>
  );
}

export default Products;
