// PATH: src/components/products/productCard/AddToCartButton.jsx
import React from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAddToCartMutation, useRemoveFromCartMutation } from "@/hooks/useCart";

const AddToCartButton = ({
  outOfStock,
  stock = 0,
  productId,
  image,
  title,
  slug,
  price,
}) => {
  // ১. Zustand স্টোর থেকে শুধু কার্টের কারেন্ট অবজেক্ট রিড করছি
  const cart = useCartStore((state) => state.cart);
  const quantity = cart[productId]?.quantity || 0;

  // ২. TanStack Query Mutations ইম্পোর্ট করলাম (যা ডাটাবেজ আপডেট করবে)
  const { mutate: addToCart, isPending: isAdding } = useAddToCartMutation();
  const { mutate: removeFromCart, isPending: isRemoving } =
    useRemoveFromCartMutation();

  // নেটওয়ার্ক রিকোয়েস্ট চলাকালীন বাটন ডিসেবল রাখার জন্য
  const isLoading = isAdding || isRemoving;

  // OUT OF STOCK CHECK
  if (outOfStock || stock === 0) {
    return (
      <button
        disabled
        className="mt-1 flex h-9 w-full items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  // DEFAULT BUTTON (যখন কার্টে এই প্রোডাক্টটি থাকবে না)
  if (quantity === 0) {
    return (
      <button
        type="button"
        disabled={isLoading}
        onClick={() => addToCart({ productId, quantity: 1 })}
        className="mt-1 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-black text-sm font-medium text-white transition-all duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart size={15} />
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>
    );
  }

  // QUANTITY CONTROLLER (- 1 +)
  return (
    <div className="mt-1 flex h-9 w-full items-center overflow-hidden rounded-lg border border-gray-200">
      {/* মাইনাস বাটন */}
      <button
        type="button"
        disabled={isLoading}
        onClick={() => removeFromCart({ productId })}
        className="flex h-full w-10 items-center justify-center bg-gray-50 transition hover:bg-gray-100 disabled:opacity-50"
      >
        <Minus size={15} />
      </button>

      {/* কারেন্ট কোয়ান্টিটি ডিসপ্লে */}
      <div className="flex flex-1 items-center justify-center text-sm font-semibold text-gray-700">
        {quantity}
      </div>

      {/* প্লাস বাটন */}
      <button
        type="button"
        disabled={quantity >= stock || isLoading}
        onClick={() => addToCart({ productId, quantity: 1 })}
        className={`flex h-full w-10 items-center justify-center transition ${
          quantity >= stock || isLoading
            ? "cursor-not-allowed bg-gray-100 text-gray-300"
            : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <Plus size={15} />
      </button>
    </div>
  );
};

export default AddToCartButton;
