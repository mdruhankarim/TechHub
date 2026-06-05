export function getProductBadge(product) {
  if (product.stock === 0) return "Out of Stock";

  if (product.compareAtPrice > product.price) {
    const pct = Math.round(
      ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
    );
    return `-${pct}%`;
  }

  const daysSince =
    (Date.now() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24);
  if (daysSince < 14) return "New";

  return null;
}

/**
 * Counts how many filters are currently active
 * Used for the mobile filter badge count
 */
export function countActiveFilters(filters) {
  return [
    filters.search,
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
    filters.availability?.length,
    filters.minRating,
  ].filter(Boolean).length;
}

/**
 * Splits a sort string like "price_asc" into { sortBy, order }
 */
export function parseSortValue(value) {
  const lastUnderscore = value.lastIndexOf("_");
  return {
    sortBy: value.slice(0, lastUnderscore),
    order: value.slice(lastUnderscore + 1),
  };
}
