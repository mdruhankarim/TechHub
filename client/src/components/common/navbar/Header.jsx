"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import Logo from "./Logo";
import NavLinks, { navLinks } from "./NavLinks";
import SearchBar from "./SearchBar";
import Actions from "./Actions";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <Actions cartCount={cartCount} />
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
