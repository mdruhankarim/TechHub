// PATH: src/components/Header/Actions.jsx
import { ShoppingCart } from "lucide-react";
import { Button } from "../../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useGetProfile } from "@/hooks/user.query";
import { useCartStore } from "@/store/useCartStore";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import CartSidebar from "@/components/CartSidebar";

export default function Actions() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProfile();

  // Read current live state from the Zustand store hook
  const cart = useCartStore((state) => state.cart);
  const cartCount = Object.values(cart).reduce((total, item) => total + (item?.quantity || 0), 0);

  const user = data?.data?.user;
  const isSignedIn = !!user;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  const handleLogout = async () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Loading skeleton */}
      {isLoading && <Skeleton className="w-9 h-9 rounded-full" />}

      {/* Signed out state */}
      {!isLoading && !isSignedIn && (
        <Link to="/login">
          <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1.5 text-sm font-normal text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2.5 h-8 rounded-md">
            Sign In
          </Button>
        </Link>
      )}

      {/* Signed in avatar + dropdown */}
      {!isLoading && isSignedIn && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex items-center justify-center hover:ring-2 hover:ring-blue-200 transition-all focus:outline-none">
              {user.avatar ? <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" /> : initials}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="font-semibold text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground font-normal truncate">{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>My Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/orders")}>My Orders</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Cart Sidebar Trigger */}
      <CartSidebar>
        {/* FIXED: Removed relative configuration so contents align inline perfectly inside the center row */}
        <Button className="flex items-center justify-center gap-2 rounded-md bg-black hover:bg-gray-900 text-white text-sm font-medium px-4 h-9 transition-colors">
          <ShoppingCart className="w-4 h-4" />
          <span>Cart</span>

          {/* FIXED: Dynamic badge flows cleanly within the button alignment now */}
          {cartCount > 0 && (
            <span className="bg-white text-black text-[11px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5 ml-0.5 shadow-sm">
              {cartCount}
            </span>
          )}
        </Button>
      </CartSidebar>
    </div>
  );
}
