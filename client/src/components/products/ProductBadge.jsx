import React from "react";
import { Heart } from "lucide-react";

const ProductBadge = ({ badge, isWishlisted }) => {
  const badgeStyles = {
    warning: "bg-orange-50 text-orange-500",
    sale: "bg-red-50 text-red-500",
    success: "bg-green-50 text-green-600",
    dark: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <span
        className={`rounded-md px-2 py-1 text-[10px] sm:text-[11px] font-semibold ${badgeStyles[badge?.type]}`}
      >
        {badge?.text}
      </span>

      <button>
        <Heart
          size={17}
          className={
            isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
          }
        />
      </button>
    </div>
  );
};

export default ProductBadge;
