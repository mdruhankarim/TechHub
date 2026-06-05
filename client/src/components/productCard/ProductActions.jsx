// PATH: src/components/products/productCard/ProductActions.jsx
// FILE: ProductActions.jsx

import React from "react";
import { Eye, GitCompare } from "lucide-react";

const ProductActions = ({ slug }) => {
  // Prevent clicking these actions from triggering the parent card navigation
  const handleActionClick = (e, actionType) => {
    e.stopPropagation();
    e.preventDefault();

    if (actionType === 'view') {
      console.log("Quick view clicked for:", slug);
      // Your future quick view modal logic here
    } else if (actionType === 'compare') {
      console.log("Compare clicked for:", slug);
      // Your future compare logic here
    }
  };

  return (
    <div className="absolute right-1 top-1/2 flex -translate-y-1/2 translate-x-3 flex-col gap-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 z-10">
      <button
        type="button"
        onClick={(e) => handleActionClick(e, 'view')}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
      >
        <Eye size={15} />
      </button>

      <button
        type="button"
        onClick={(e) => handleActionClick(e, 'compare')}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
      >
        <GitCompare size={15} />
      </button>
    </div>
  );
};

export default ProductActions;
