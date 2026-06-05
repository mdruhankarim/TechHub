import { useState } from "react";
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
} from "@/lib/products/product.constants";
import { parseSortValue } from "@/lib/products/product.utils";

export function useProductFilters() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);

  const handleSortChange = (value) => {
    setSort(value);
    const { sortBy, order } = parseSortValue(value);
    setFilters((prev) => ({ ...prev, sortBy, order, cursor: null }));
    // page reset এর বদলে cursor null — মানে শুরু থেকে
  };

  const handleNextPage = (nextCursor) => {
    setFilters((prev) => ({ ...prev, cursor: nextCursor }));
    // পরের page = nextCursor set করো
  };

  const handlePrevPage = (prevCursor) => {
    setFilters((prev) => ({ ...prev, cursor: prevCursor ?? null }));
    // আগের page = prevCursor, একদম শুরুতে গেলে null
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setSort(SORT_OPTIONS[0].value);
  };

  return {
    filters,
    sort,
    setFilters,
    handleSortChange,
    handleNextPage,
    handlePrevPage,
    handleClear,
  };
}
