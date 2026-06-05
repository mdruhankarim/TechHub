// PATH: src/components/products/ActiveFilterBadges.jsx
// FILE: ActiveFilterBadges.jsx

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ActiveFilterBadges({ filters, setFilters, categories }) {
  const hasAny =
    filters.search ||
    filters.categoryId ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating;

  if (!hasAny) return null;

  const remove = (patch) =>
    setFilters((f) => ({ ...f, ...patch, page: 1 }));

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.search && (
        <FilterChip
          label={`Search: ${filters.search}`}
          onRemove={() => remove({ search: "" })}
        />
      )}

      {filters.categoryId && categories && (
        <FilterChip
          label={categories.find((c) => c._id === filters.categoryId)?.name}
          onRemove={() => remove({ categoryId: "" })}
        />
      )}

      {(filters.minPrice || filters.maxPrice) && (
        <FilterChip
          label={`$${filters.minPrice || "0"} – $${filters.maxPrice || "∞"}`}
          onRemove={() => remove({ minPrice: "", maxPrice: "" })}
        />
      )}

      {filters.minRating && (
        <FilterChip
          label={`${filters.minRating}★ & up`}
          onRemove={() => remove({ minRating: null })}
        />
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`}>
        <X className="w-3 h-3" />
      </button>
    </Badge>
  );
}
