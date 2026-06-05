import { useState } from "react";

import { ShoppingCart, User } from "lucide-react";

import { Button } from "../../ui/button";
import { Link } from "react-router-dom";

// import CartDrawer from "../../cart/CartDrawer";

export default function Actions() {
  const [openCart, setOpenCart] = useState(false);

  // Dummy cart count
  const cartCount = 0;

  // Dummy auth state
  const isSignedIn = false;

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Signed Out */}
        {!isSignedIn && (
          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-1.5 text-sm font-normal text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2.5 h-8 rounded-md"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </Button>
          </Link>
        )}

        {/* Signed In */}
        {isSignedIn && (
          <div className="hidden md:flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-8 h-8 p-0"
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Cart Button */}
        <Button
          onClick={() => setOpenCart(true)}
          className="relative flex items-center gap-1.5 rounded-md bg-black hover:bg-gray-900 text-white text-sm font-medium px-4 h-9 transition-all"
        >
          <ShoppingCart className="w-4 h-4" />

          <span>Cart</span>

          {cartCount > 0 && (
            <div
              className="
                absolute -top-1.5 -right-1.5
                bg-red-600 text-white text-[10px] font-medium
                min-w-[18px] h-[18px]
                flex items-center justify-center
                rounded-full border-[2.5px] border-white
                shadow-sm
              "
            >
              {cartCount}
            </div>
          )}
        </Button>
      </div>

      {/* Cart Drawer */}
      {/*
      <CartDrawer
        open={openCart}
        onOpenChange={setOpenCart}
      />
      */}
    </>
  );
}
