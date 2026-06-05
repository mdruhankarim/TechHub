import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useGetProfile } from "@/hooks/user.query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function Actions() {
  const cartCount = 0;
  const navigate = useNavigate();
  const { data, isLoading } = useGetProfile();

  const user = data?.data?.user;
  const isSignedIn = !!user;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  const handleLogout = async () => {
    // call your logout mutation here
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Loading skeleton */}
      {isLoading && (
        <Skeleton className="w-9 h-9 rounded-full" />
      )}

      {/* Signed out */}
      {!isLoading && !isSignedIn && (
        <Link to="/login">
          <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1.5 text-sm font-normal text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2.5 h-8 rounded-md">
            Sign In
          </Button>
        </Link>
      )}

      {/* Signed in — avatar + dropdown */}
      {!isLoading && isSignedIn && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex items-center justify-center hover:ring-2 hover:ring-blue-200 transition-all focus:outline-none">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                initials
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="font-semibold text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground font-normal truncate">{user.email}</span>
              {user.role === "Admin" && (
                <span className="mt-1 text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full w-fit">
                  Admin
                </span>
              )}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>My Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/orders")}>My Orders</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/addresses")}>Addresses</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Cart */}
      <Button className="relative flex items-center gap-1.5 rounded-md bg-black hover:bg-gray-900 text-white text-sm font-medium px-4 h-9">
        <ShoppingCart className="w-4 h-4" />
        <span>Cart</span>
        {cartCount > 0 && (
          <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-medium min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-[2.5px] border-white">
            {cartCount}
          </div>
        )}
      </Button>
    </div>
  );
}
