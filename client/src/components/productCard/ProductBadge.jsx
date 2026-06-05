// PATH: src/components/products/productCard/ProductBadge.jsx
// FILE: ProductBadge.jsx

import React from "react";
import { Heart } from "lucide-react";

const ProductBadge = ({ badge, isWishlisted }) => {
  const badgeStyles = {
    warning: "bg-orange-50 text-orange-500",
    sale: "bg-red-50 text-red-500",
    success: "bg-emerald-50 text-emerald-600",
    dark: "bg-gray-100 text-gray-700",
  };

  // Prevent wishlist clicks from triggering any underlying layout clicks
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Wishlist toggled");
    // Your future wishlist toggle function goes here
  };

  return (
    <div className="mb-2 flex items-center justify-between gap-2 min-h-[24px] relative z-10">
      {badge?.text ? (
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold ${badgeStyles[badge?.type]}`}
        >
          {badge?.text}
        </span>
      ) : (
        <div></div>
      )}

      <button
        type="button"
        onClick={handleWishlistClick}
        className="text-gray-400 hover:text-red-500 transition-colors p-1"
      >
        <Heart
          size={17}
          className={isWishlisted ? "fill-red-500 text-red-500" : ""}
        />
      </button>
    </div>
  );
};

export default ProductBadge;
