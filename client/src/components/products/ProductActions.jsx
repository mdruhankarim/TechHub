import React from "react";
import { Eye, GitCompare } from "lucide-react";

const ProductActions = () => {
  return (
    <div className="absolute right-1 top-1/2 flex -translate-y-1/2 translate-x-3 flex-col gap-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
      <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
        <Eye size={15} />
      </button>

      <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
        <GitCompare size={15} />
      </button>
    </div>
  );
};

export default ProductActions;
