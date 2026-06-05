import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore"; // Import store

import Logo from "./Logo";
import NavLinks, { navLinks } from "./NavLinks";
import SearchBar from "./SearchBar";
import Actions from "./Actions";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Read current live cart state from Zustand
  const cart = useCartStore((state) => state.cart);

  // FIXED: Added optional chaining (?.) and a fallback (|| 0) to prevent
  // runtime crashes if cart items don't strictly exist yet during initial state sync
  const cartCount = Object.values(cart).reduce(
    (total, item) => total + (item?.quantity || 0),
    0,
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white transition-shadow duration-300",
        scrolled ? "shadow-sm" : "border-b border-gray-200",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between gap-4">
          <Logo />
          <NavLinks />
          <SearchBar />

          <div className="flex items-center gap-2 shrink-0">
            <Actions />
            <MobileMenu
              cartCount={cartCount}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              navLinks={navLinks}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
