import React, { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useGetCategories } from "@/hooks/useProducts";



// Reusable item skeleton block to match your sidebar layouts
const FilterItemSkeleton = ({ count = 5 }) => (
  <div className="space-y-3 pt-1 animate-pulse">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex items-center space-x-3">
        <Skeleton className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-800 shrink-0" />
        <Skeleton className={`h-3 bg-slate-200 dark:bg-slate-800 ${i % 2 === 0 ? 'w-28' : 'w-20'}`} />
      </div>
    ))}
  </div>
);

const FilterSidebar = ({ brands = [], isInitialLoading }) => {
  // 1. Get the data straight from your hook
  const { data: apiResponse, isLoading: isCategoriesLoading } = useGetCategories();

  // 2. Extract the array based on your exact console log structure
  const categories = apiResponse?.data?.categories || [];

  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Combined loading state for skeletons
  const showCategoriesSkeleton = isCategoriesLoading || isInitialLoading;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">Filters</h3>
        <hr className="border-slate-100 dark:border-slate-800" />
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "brands"]} className="w-full">
        {/* Categories Section */}
        <AccordionItem value="categories" className="border-b border-slate-100 dark:border-slate-800">
          <AccordionTrigger className="text-sm font-medium text-slate-700 dark:text-slate-300 py-3 hover:no-underline">
            Categories
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4 space-y-3">
            {showCategoriesSkeleton ? (
              <FilterItemSkeleton count={5} />
            ) : (
              // 3. Map over the objects using ._id and .name
              categories.map((category) => (
                <div key={category._id} className="flex items-center space-x-3">
                  <Checkbox id={`cat-${category._id}`} />
                  <label
                    htmlFor={`cat-${category._id}`}
                    className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              ))
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Section */}
        <AccordionItem value="price" className="border-b border-slate-100 dark:border-slate-800">
          <AccordionTrigger className="text-sm font-medium text-slate-700 dark:text-slate-300 py-3 hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-5 px-1">
            <Slider
              defaultValue={[0, 1000]}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-4"
              disabled={isInitialLoading}
            />
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Min</span>
                {isInitialLoading ? (
                  <Skeleton className="mt-1 h-8 w-full rounded-md bg-slate-200 dark:bg-slate-800" />
                ) : (
                  <div className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900">
                    ${priceRange[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Max</span>
                {isInitialLoading ? (
                  <Skeleton className="mt-1 h-8 w-full rounded-md bg-slate-200 dark:bg-slate-800" />
                ) : (
                  <div className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900">
                    ${priceRange[1]}
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands Section */}
        <AccordionItem value="brands" className="border-none">
          <AccordionTrigger className="text-sm font-medium text-slate-700 dark:text-slate-300 py-3 hover:no-underline">
            Brands
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2 space-y-3">
            {brands.length === 0 ? (
              <FilterItemSkeleton count={5} />
            ) : (
              brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-3">
                  <Checkbox id={`brand-${brand}`} />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-none cursor-pointer"
                  >
                    {brand}
                  </label>
                </div>
              ))
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        disabled={isInitialLoading}
        className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 rounded-lg text-sm transition-all shadow-sm"
      >
        Apply Filters
      </Button>
    </div>
  );
};
const ProductPage = () => {
  // Pure JS state variables initialization
  const [categoriesData, setCategoriesData] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated API call hook
  useEffect(() => {
    const timer = setTimeout(() => {
      setCategoriesData(["Electronics", "Apparel", "Home & Kitchen", "Books", "Sports"]);
      setBrandsData(["Apple", "Nike", "Sony", "Samsung", "Adidas"]);
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">All Products</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Browse and manage all your products in one place.
            </p>
          </div>

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto gap-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md p-6 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-left text-lg font-semibold text-slate-900 dark:text-slate-50">Filter Products</SheetTitle>
                  <SheetDescription className="sr-only">
                    Narrow down your product catalogs by selecting specific metrics, cost caps, and hardware brands.
                  </SheetDescription>
                </SheetHeader>
                <div className="overflow-y-auto h-[calc(100vh-8rem)] pr-2">
                  <FilterSidebar
                    categories={categoriesData}
                    brands={brandsData}
                    isInitialLoading={isLoading}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-6 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto shadow-sm backdrop-blur-md">
              <FilterSidebar
                categories={categoriesData}
                brands={brandsData}
                isInitialLoading={isLoading}
              />
            </div>
          </aside>

          {/* Main Content Pane */}
          <div className="flex-1 min-w-0">
            <div className="h-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 mb-4 shadow-sm" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm"
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
