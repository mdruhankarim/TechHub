// MobileMenu.jsx

import { Link } from "react-router-dom";

import { Search, ShoppingCart, User } from "lucide-react";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";

export default function MobileMenu({
  cartCount,
  mobileOpen,
  setMobileOpen,
  navLinks,
}) {
  return (
    <div className="lg:hidden">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-md hover:bg-gray-100"
            aria-label="Open menu"
          >
            <span className="flex flex-col justify-center items-center gap-[5px] w-5">
              <span className="w-full h-[1.5px] bg-gray-700 rounded" />
              <span className="w-full h-[1.5px] bg-gray-700 rounded" />
              <span className="w-full h-[1.5px] bg-gray-700 rounded" />
            </span>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-72 p-0">
          <SheetHeader className="px-5 py-4 border-b">
            <SheetTitle className="text-left flex items-center gap-1.5">
              <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">T</span>
              </div>

              <span className="text-sm font-bold">TechHub</span>
            </SheetTitle>
          </SheetHeader>

          <div className="p-5 flex flex-col gap-1">
            {/* Mobile Search */}
            <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 gap-2 mb-4 focus-within:ring-1 focus-within:ring-gray-300">
              <Input
                placeholder="Search..."
                className="border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none placeholder:text-gray-400"
              />

              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Separator className="my-3" />

            <Link
              to="/account"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <User className="w-4 h-4" />
              Account
            </Link>

            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart ({cartCount})
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
