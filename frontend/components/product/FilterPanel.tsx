import { FilterKey } from "@/utils/productHelpers";
import { useState } from "react";

interface Category {
  slug: string;
  name: string;
}

interface FilterPanelProps {
  categories: Category[];
  category: string;
  organic: string;
  minPrice: string;
  maxPrice: string;

  // Parent controls URL state.
  // Child only sends "what changed".
  updateFilter: (key: FilterKey, value: string) => void;

  // Single reset function keeps clearing logic centralized
  clearFilters: () => void;

  // Used for conditional UI:
  // only show reset action when filters are active
  hasFilters: boolean;
}

function FilterPanel({
  categories,
  category,
  organic,
  minPrice,
  maxPrice,
  hasFilters,
  updateFilter,
  clearFilters,
}: FilterPanelProps) {
  // Add virtual option without modifying original category data
  const categoriesWithAll = [
    {
      slug: "",
      name: "All Categories",
    },
    ...categories,
  ];

  // Local state prevents URL updates on every key press.
  // Apply button commits changes intentionally.
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  return (
    <div className="space-y-6">
      {/* Category selection pattern: URL value determines active state */}
      <div className="">
        <h3 className="text-sm font-semibold text-app-green mb-3">
          Categories
        </h3>
        <div className="space-y-1.5">
          {categoriesWithAll.map((cat) => (
            <button
              type="button"
              key={cat.slug || "all"}
              // Child emits change request;
              // parent updates query params
              onClick={() => updateFilter("category", cat.slug)}
              // Selected state comes from URL
              className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-all ${category === cat.slug ? "bg-app-green text-white" : "text-app-text-light hover:bg-app-cream"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      {/* Radio group: Empty value behaves as "show all" */}
      <div>
        <h3 className="text-sm font-semibold text-app-green mb-3">
          Product Type
        </h3>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={organic === ""}
              // Remove filter from URL
              onChange={() => updateFilter("organic", "")}
            />
            All
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={organic === "true"}
              // Filter only matching products
              onChange={() => updateFilter("organic", "true")}
            />
            Organic Only
          </label>
        </div>
      </div>
      {/* Local input → Apply → URL update; Useful pattern for search/filter forms */}
      <div className="">
        <h3 className="text-sm font-semibold text-app-green mb-3">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={localMin}
            // Update local state only
            onChange={(e) => setLocalMin(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white rounded-lg border not-focus:border-app-border"
          />
          <span className="text-app-text-light">-</span>
          <input
            type="number"
            placeholder="Max Price"
            value={localMax}
            // Update local state only
            onChange={(e) => setLocalMax(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white rounded-lg border not-focus:border-app-border"
          />
        </div>
        <button
          type="button"
          // Commit both values together
          onClick={() => {
            updateFilter("minPrice", localMin);
            updateFilter("maxPrice", localMax);
          }}
          className="w-full mt-3 py-2.5 px-4 bg-app-green text-white text-sm font-medium rounded-xl hover:bg-app-green-light transition-colors duration-200 shadow-sm"
        >
          Apply
        </button>
      </div>

      {/* Conditional actions improve UX: avoid showing inactive controls */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full py-2 text-sm text-app-error hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default FilterPanel;
