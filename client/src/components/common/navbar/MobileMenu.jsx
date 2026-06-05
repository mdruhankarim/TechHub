import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Package, MapPin, Settings, LogOut } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../ui/sheet";
import { useGetProfile } from "@/hooks/user.query";

export default function MobileMenu({ cartCount, mobileOpen, setMobileOpen, navLinks }) {
  const { data } = useGetProfile();
  const user = data?.data?.user;
  const isSignedIn = !!user;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

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

        <SheetContent side="right" className="w-72 p-0" aria-describedby={undefined}>
          <SheetHeader className="px-5 py-4 border-b">
            <SheetTitle className="text-left flex items-center gap-1.5">
              <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">T</span>
              </div>
              <span className="text-sm font-bold">TechHub</span>
            </SheetTitle>
          </SheetHeader>

          <div className="p-5 flex flex-col gap-1">
            {/* User info block */}
            {isSignedIn ? (
              <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex items-center justify-center shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  {user.role === "Admin" && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Admin</span>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 mb-2 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors justify-center"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Mobile Search */}
            <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 gap-2 mb-3 focus-within:ring-1 focus-within:ring-gray-300">
              <Input
                placeholder="Search..."
                className="border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none placeholder:text-gray-400"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </div>

            {/* Nav links */}
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

            {/* Signed-in user pages */}
            {isSignedIn && (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <Package className="w-4 h-4" /> My Orders
                </Link>
                <Link to="/addresses" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <MapPin className="w-4 h-4" /> Addresses
                </Link>
                <Link to="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <Separator className="my-3" />
                <button
                  onClick={() => { /* call logout */ setMobileOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            )}

            {/* Cart */}
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
