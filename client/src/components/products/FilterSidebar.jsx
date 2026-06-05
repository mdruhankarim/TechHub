import { Search, RotateCcw } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  AVAILABILITY_OPTIONS,
  RATINGS,
} from "@/lib/products/product.constants";
import { Checkbox } from "../ui/checkbox";

const FilterSection = ({ title, children }) => {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-900 mb-2">{title}</p>
      {children}
    </div>
  );
};

const SearchFilter = ({ value, onChange }) => {
  return (
    <FilterSection title="Search">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>
    </FilterSection>
  );
};

const CategoryBtn = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
        active
          ? "bg-gray-900 text-white font-medium"
          : "text-gray-600 hover:bg-gray-100",
      )}
    >
      {label}
    </button>
  );
};

const CategoryFilter = ({ categories, selected, onChange }) => {
  return (
    <FilterSection title="Category">
      <div className="space-y-1">
        <CategoryBtn
          label="All Categories"
          active={!selected}
          onClick={() => onChange("")}
        />
        {categories?.map((cat) => (
          <CategoryBtn
            key={cat._id}
            label={cat.name}
            active={selected === cat._id}
            onClick={() => onChange(cat._id)}
          />
        ))}
      </div>
    </FilterSection>
  );
};

const PriceInput = ({ placeholder, value, onChange }) => {
  return (
    <div className="relative flex-1">
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        $
      </span>
      <Input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-6 h-9 text-sm"
      />
    </div>
  );
};

const PriceFilter = ({ min, max, onMinChange, onMaxChange }) => {
  return (
    <FilterSection title="Price Range">
      <div className="flex items-center gap-2">
        <PriceInput placeholder="Min" value={min} onChange={onMinChange} />
        <PriceInput placeholder="Max" value={max} onChange={onMaxChange} />
      </div>
    </FilterSection>
  );
};

const AvailabilityFilter = ({ selected, onChange }) => {
  const toggle = (value, checked) => {
    const next = checked
      ? [...(selected || []), value]
      : (selected || []).filter((v) => v !== value);
    onChange(next);
  };

  return (
    <FilterSection title="Availability">
      <div className="space-y-2">
        {AVAILABILITY_OPTIONS.map(({ label, value, color }) => (
          <label key={value} className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={selected?.includes(value)}
              onCheckedChange={(checked) => toggle(value, checked)}
            />
            <span className={cn("text-sm", color)}>{label}</span>
          </label>
        ))}
      </div>
    </FilterSection>
  );
};

const RatingFilter = ({ selected, onChange }) => {
  return (
    <FilterSection title="Rating">
      <div className="space-y-2">
        {RATINGS.map((r) => (
          <label key={r} className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={selected === r}
              onCheckedChange={(checked) => onChange(checked ? r : null)}
            />
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "text-sm",
                    i < r ? "text-yellow-400" : "text-gray-300",
                  )}
                >
                  ★
                </span>
              ))}
            </div>
          </label>
        ))}
      </div>
    </FilterSection>
  );
};

export const FilterSidebar = ({ filters, setFilters, categories, onClear }) => {
  const update = (patch) => setFilters((f) => ({ ...f, ...patch, page: 1 }));

  return (
    <div className="space-y-6">
      <SearchFilter
        value={filters.search}
        onChange={(v) => update({ search: v })}
      />
      <CategoryFilter
        categories={categories}
        selected={filters.category}
        onChange={(v) => update({ category: v })}
      />
      <PriceFilter
        min={filters.minPrice}
        max={filters.maxPrice}
        onMinChange={(v) => update({ minPrice: v })}
        onMaxChange={(v) => update({ maxPrice: v })}
      />
      <AvailabilityFilter
        selected={filters.availability}
        onChange={(v) => update({ availability: v })}
      />
      <RatingFilter
        selected={filters.minRating}
        onChange={(v) => update({ minRating: v })}
      />
      <Button
        variant="outline"
        className="w-full gap-2 text-sm"
        onClick={onClear}
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Clear Filters
      </Button>
    </div>
  );
};
