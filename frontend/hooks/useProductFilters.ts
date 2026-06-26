import {
  useSearchParams, // read query params
  useRouter, // navigate/update URL
  usePathname, // get current route
} from "next/navigation";
import { FilterKey } from "@/utils/productCategoryKey";
import { buildUpdatedParams } from "@/utils/updateProductSearchParams";

export function useProductFilters() {
  // Reads URL values like ?category=fruits
  // URL acts as global state.
  // Filters become shareable, bookmarkable and persistent.
  const searchParams = useSearchParams();

  // Used to change route programmatically
  const router = useRouter();

  // Current page path (/products)
  const pathname = usePathname();

  const category = searchParams.get("category") || "";
  const organic = searchParams.get("organic") || "";
  const sort = searchParams.get("sort") || "default";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const page = Number(searchParams.get("page")) || 1;

  const hasFilters = !!(category || organic || minPrice || maxPrice);

  const updateFilter = (key: FilterKey, value: string) => {
    const params = buildUpdatedParams(searchParams, key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    filters: { category, organic, sort, minPrice, maxPrice, page },
    hasFilters,
    updateFilter,
    clearFilters,
  };
}
