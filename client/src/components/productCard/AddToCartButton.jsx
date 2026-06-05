import React from "react";
import { ShoppingCart } from "lucide-react";

const AddToCartButton = ({ outOfStock }) => {
  if (outOfStock) {
    return (
      <button
        disabled
        className="mt-1 flex h-9 w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      type="button"
      className="mt-1 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all duration-200"
    >
      <ShoppingCart size={15} />
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
