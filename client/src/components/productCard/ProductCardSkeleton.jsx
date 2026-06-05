import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <Skeleton className="h-[150px] w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );
};

export default ProductCardSkeleton;
