// PATH: src/components/products/productCard/AddToCartButton.jsx
import React from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const AddToCartButton = ({
  outOfStock,
  stock = 0,
  productId,
  image,
  title,
  slug,
  price
}) => {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const quantity = cart[productId]?.quantity || 0;

  // Package the complete real data to save in store
  const productPayload = { productId, stock, image, title, slug, price };

  // OUT OF STOCK
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

  // DEFAULT BUTTON
  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={() => addToCart(productPayload)}
        className="mt-1 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-black text-sm font-medium text-white transition-all duration-200 hover:bg-gray-800"
      >
        <ShoppingCart size={15} />
        Add to Cart
      </button>
    );
  }

  // QUANTITY CONTROLLER
  return (
    <div className="mt-1 flex h-9 w-full items-center overflow-hidden rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={() => decreaseQuantity(productId)}
        className="flex h-full w-10 items-center justify-center bg-gray-50 transition hover:bg-gray-100"
      >
        <Minus size={15} />
      </button>

      <div className="flex flex-1 items-center justify-center text-sm font-semibold">
        {quantity}
      </div>

      <button
        type="button"
        disabled={quantity >= stock}
        onClick={() => addToCart(productPayload)}
        className={`flex h-full w-10 items-center justify-center transition ${
          quantity >= stock
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
