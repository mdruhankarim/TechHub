import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import UtilityBar        from "./UtilityBar";
import NavBrand          from "./NavBrand";
import SearchBar         from "./SearchBar";
import NavActions        from "./NavActions";
import NavLinks          from "./NavLinks";
import MegaMenuSidebar   from "./MegaMenuSidebar";
import HeroBlock         from "./HeroBlock";
import StoreFeatures     from "./StoreFeatures";
import MobileDrawer      from "./MobileDrawer";

gsap.registerPlugin(useGSAP);

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeSidebarCat, setActiveSidebarCat] = useState("Laptop & Computer");

  const containerRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  // GSAP nav-link roll-up handlers — must stay here (contextSafe scope is on containerRef)
  const handleMouseEnter = contextSafe((e) => {
    const primary   = e.currentTarget.querySelector(".nav-primary");
    const secondary = e.currentTarget.querySelector(".nav-secondary");
    if (!primary || !secondary) return;
    gsap.killTweensOf([primary, secondary]);
    gsap.to(primary,   { y: "-100%", duration: 0.2, ease: "power1.out" });
    gsap.to(secondary, { y: "-100%", duration: 0.2, ease: "power1.out" });
  });

  const handleMouseLeave = contextSafe((e) => {
    const primary   = e.currentTarget.querySelector(".nav-primary");
    const secondary = e.currentTarget.querySelector(".nav-secondary");
    if (!primary || !secondary) return;
    gsap.killTweensOf([primary, secondary]);
    gsap.to(primary,   { y: "0%", duration: 0.2, ease: "power1.out" });
    gsap.to(secondary, { y: "0%", duration: 0.2, ease: "power1.out" });
  });

  return (
    <div
      ref={containerRef}
      className="w-full bg-white border-b border-gray-100 font-sans antialiased selection:bg-orange-500 selection:text-white relative"
    >
      {/* Top utility bar (desktop only) */}
      <UtilityBar />

      <div className="container mx-auto px-4 lg:px-6">

        {/* Row 1 — Logo / Search / Actions */}
        <div className="flex items-center justify-between py-4 lg:py-5 gap-4">
          <NavBrand onMobileMenuOpen={() => setMobileMenuOpen(true)} />
          <SearchBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <NavActions />
        </div>

        {/* Row 2 — Animated nav links (desktop) */}
        <NavLinks
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />

        {/* Row 3 — Mega-menu sidebar + hero block */}
        <div className="flex gap-6 py-6 border-t border-gray-100 items-start min-w-0">
          <MegaMenuSidebar
            activeCat={activeSidebarCat}
            onCatHover={setActiveSidebarCat}
          />
          <HeroBlock />
        </div>

        {/* Row 4 — Trust / feature badges */}
        <StoreFeatures />

      </div>

      {/* Mobile slide-over drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
};

export default Navbar;
