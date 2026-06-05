import React from "react";
import { User, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const NavActions = () => (
  <div className="flex items-center gap-3 lg:gap-5">
    <Link
      to="/login"
      className="hidden sm:flex items-center gap-2.5 text-left text-gray-700 hover:text-orange-600 transition-colors group"
    >
      <div className="p-2 border border-gray-200 rounded-full bg-white group-hover:bg-orange-50 group-hover:border-orange-200 transition-colors">
        <User size={20} className="group-hover:text-orange-600" />
      </div>
      <div className="hidden lg:block text-xs">
        <p className="text-gray-400 font-normal leading-tight">Account</p>
        <span className="font-semibold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
          Sign In
        </span>
      </div>
    </Link>

    <button
      className="p-2 lg:p-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-all relative group"
      aria-label="Wishlist"
    >
      <Heart size={22} className="w-5 h-5 lg:w-6 lg:h-6" />
      <span className="absolute top-0.5 right-0.5 lg:top-1 lg:right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white box-content">
        2
      </span>
    </button>

    <button
      className="p-2 lg:p-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-all relative group"
      aria-label="Cart"
    >
      <ShoppingCart size={22} className="w-5 h-5 lg:w-6 lg:h-6" />
      <span className="absolute top-0.5 right-0.5 lg:top-1 lg:right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white box-content">
        3
      </span>
    </button>
  </div>
);

export default NavActions;
