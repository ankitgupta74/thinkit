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
