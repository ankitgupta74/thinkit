import { useMemo } from "react";

interface UsePaginationProps<T> {
  // Any list: products, orders, users etc.
  items: T[];

  // Current selected page
  page: number;

  // Items shown per page
  itemsPerPage: number;
}

function usePagination<T>({
  items,
  page,
  itemsPerPage,
}: UsePaginationProps<T>) {
  // Example:
  // 50 products
  // 10 per page
  // totalPages=5
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // useMemo avoids recalculating unless dependency changes
  const paginatedItems = useMemo(() => {
    // Formula:
    // page 1 -> start 0
    // page 2 -> start 10
    // page 3 -> start 20

    const start = (page - 1) * itemsPerPage;

    // End boundary
    const end = start + itemsPerPage;

    // Return only current page data
    return items.slice(start, end);
  }, [items, page, itemsPerPage]);

  return {
    // Items visible right now
    paginatedItems,

    // Number of pages
    totalPages,

    // Useful for labels: "120 products found"
    totalItems: items.length,
  };
}

export default usePagination;
