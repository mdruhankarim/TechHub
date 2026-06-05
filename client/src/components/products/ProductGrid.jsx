// PATH: src/components/products/ProductGrid.jsx
// FILE: ProductGrid.jsx

import { cn } from "@/lib/utils";

import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { getProductBadge } from "@/lib/products/product.utils";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

const GRID_CLASS = "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";
const LIST_CLASS = "grid-cols-1";

export function ProductGrid({ products, isLoading, view, onClear }) {
  const gridClass = cn("grid gap-4", view === "grid" ? GRID_CLASS : LIST_CLASS);

  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-sm">No products found.</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={onClear}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          image={product.images?.[0]?.url || "/placeholder.png"}
          title={product.title}
          subtitle={product.description}
          price={product.price}
          oldPrice={product.compareAtPrice}
          rating={product.ratingAverage}
          reviews={product.ratingCount}
          stock={product.stock}
          badge={getProductBadge(product)}
          outOfStock={product.stock === 0}
          productId={product._id}
          slug={product.slug}
          priority={index < 4} // ← first 4 images load eagerly (above the fold)
        />
      ))}
    </div>
  );
}
