import React from "react";
import { Menu } from "lucide-react";

const NavBrand = ({ onMobileMenuOpen }) => (
  <div className="flex items-center gap-3 lg:gap-4">
    <button
      className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      onClick={onMobileMenuOpen}
      aria-label="Open menu"
    >
      <Menu size={24} />
    </button>
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-xl tracking-tighter">
        T
      </div>
      <span className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900 hidden sm:block">
        Tech<span className="text-gray-900/60 font-medium">Hub</span>
      </span>
    </div>
  </div>
);

export default NavBrand;
