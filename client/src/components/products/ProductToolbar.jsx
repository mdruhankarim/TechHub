import { LayoutGrid, List, Loader2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "@/lib/products/product.constants";
import { FilterSidebar } from "./FilterSidebar";

export function ProductToolbar({
  pagination,
  isLoading,
  isFetching,
  sort,
  onSortChange,
  view,
  onViewChange,
  totalActive,
  // sidebar props — forwarded for mobile sheet
  filters,
  setFilters,
  categories,
  onClear,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-4 flex flex-wrap items-center gap-3">
      {/* Mobile filter sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {totalActive > 0 && (
              <Badge className="bg-gray-900 text-white text-[10px] h-4 min-w-4 px-1">
                {totalActive}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-5 pt-5 overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription className="sr-only">
              Filter products by category, price, availability, and rating.
            </SheetDescription>
          </SheetHeader>
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            onClear={onClear}
          />
        </SheetContent>
      </Sheet>

      {/* Results count */}
      <div className="text-sm text-gray-500 flex-1">
        {isLoading ? (
          <Skeleton className="h-4 w-40 inline-block" />
        ) : (
          <>
            Showing{" "}
            <span className="font-medium text-gray-900">
              {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {pagination.total}
            </span>{" "}
            products
          </>
        )}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="h-8 text-sm w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-sm">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
        {[
          { value: "grid", Icon: LayoutGrid },
          { value: "list", Icon: List },
        ].map(({ value, Icon }) => (
          <button
            key={value}
            onClick={() => onViewChange(value)}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              view === value
                ? "bg-gray-900 text-white"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Refetch indicator */}
      {isFetching && !isLoading && (
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      )}
    </div>
  );
}
