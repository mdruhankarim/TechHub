// PATH: src/components/CartSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

export default function CartSidebar({ children }) {
  const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCartStore();

  const cartItems = Object.values(cart); // Extracts our saved product items [{productId, quantity, title...}]
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white">

        {/* Header */}
        <SheetHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between shrink-0">
          <div className="flex flex-col gap-1">
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <ShoppingBag className="w-5 h-5" />
              Your Cart <span className="text-sm font-normal text-gray-500">({totalItems} items)</span>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Review items in your shopping cart.
            </SheetDescription>
          </div>

          {totalItems > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2.5 rounded-md"
            >
              Clear All
            </Button>
          )}
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base">Your cart is empty</h3>
              <p className="text-sm text-gray-500 max-w-[240px]">
                Explore our catalog and add items directly to your cart to see them here.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 bg-white p-3 border border-gray-100 rounded-xl shadow-sm transition-all hover:border-gray-200"
              >
                {/* Real Product Image with Details Redirection */}
                <Link to={`/products/${item.slug}`} className="block shrink-0 group">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-1 border border-gray-100 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain transition group-hover:scale-105"
                      />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </Link>

                {/* Details Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between gap-2 items-start">
                    <div className="min-w-0">
                      <Link to={`/products/${item.slug}`} className="hover:text-gray-600 transition-colors block">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{item.title}</h4>
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">Stock limit: {item.stock}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-gray-50 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold text-gray-900">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>

                    {/* Quantity Adjustment Controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 h-8 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.productId)}
                        className="px-2.5 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="px-1 text-xs font-semibold text-gray-900 min-w-[24px] text-center select-none">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        disabled={item.quantity >= item.stock}
                        onClick={() => addToCart(item)}
                        className={`px-2.5 h-full flex items-center justify-center transition-colors ${
                          item.quantity >= item.stock
                            ? "cursor-not-allowed bg-gray-100 text-gray-300"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Summary Container */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-4 shrink-0">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="pt-2 flex justify-between text-base font-semibold text-gray-900 border-t border-gray-200">
                <span>Total Amount</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full bg-black hover:bg-gray-900 text-white font-medium py-6 rounded-xl flex items-center justify-center gap-2 group shadow-sm transition-all">
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
