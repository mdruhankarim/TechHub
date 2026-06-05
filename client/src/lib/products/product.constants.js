export const DEFAULT_FILTERS = {
  cursor: null, // ← page এর বদলে cursor
  search: "",
  category: "", // ← categoryId এর বদলে category
  minPrice: "",
  maxPrice: "",
  availability: [],
  minRating: null,
  sortBy: "createdAt",
  order: "desc",
  limit: 20,
};

export const SORT_OPTIONS = [
  { label: "Newest First", value: "createdAt_desc" },
  { label: "Oldest First", value: "createdAt_asc" },
  { label: "Price: Low–High", value: "price_asc" },
  { label: "Price: High–Low", value: "price_desc" },
  { label: "Top Rated", value: "ratingAverage_desc" },
];

export const AVAILABILITY_OPTIONS = [
  { label: "In Stock", value: "inStock", color: "text-green-600" },
  { label: "Low Stock", value: "lowStock", color: "text-yellow-600" },
  { label: "Out of Stock", value: "outOfStock", color: "text-red-500" },
];

export const RATINGS = [5, 4, 3, 2, 1];
