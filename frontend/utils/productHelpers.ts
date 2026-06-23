import { ReadonlyURLSearchParams } from "next/navigation";


// Central list of allowed query keys.
// Gives autocomplete + prevents invalid filter names.
export type FilterKey =
  | "category"
  | "organic"
  | "sort"
  | "page"
  | "minPrice"
  | "maxPrice";

// Read URL params → modify only one field → return updated params.
// Useful whenever UI state is controlled by query strings.
export function buildUpdatedParams(
  searchParams: ReadonlyURLSearchParams,
  key: FilterKey,
  value: string,
) {
  // Convert readonly params into editable params
  const params = new URLSearchParams(searchParams.toString());

  // Add value if present.
  // Empty value means remove filter from URL.
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  // Changing filters can reduce results.
  // Reset pagination so user starts from page 1.
  if (key !== "page") {
    params.delete("page");
  }

  return params;
}

// Calculates the percentage reduction between original and selling price.
// Keep discount calculation in one reusable place.
//
// Product APIs can calculate the latest discount from price values instead of saving a separate discount field in the database.
export function calculateDiscount(
  price: number,
  originalPrice: number,
): number {
  // No discount exists when original price is missing, invalid, or not higher than the selling price.
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(originalPrice) ||
    originalPrice <= 0 ||
    price >= originalPrice
  ) {
    return 0;
  }

  // Round the result so the UI can show a clean whole-number percentage.
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}