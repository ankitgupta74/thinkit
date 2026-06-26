// Central list of allowed query keys.
// Gives autocomplete + prevents invalid filter names.
export type FilterKey =
  | "category"
  | "organic"
  | "sort"
  | "page"
  | "minPrice"
  | "maxPrice";
  