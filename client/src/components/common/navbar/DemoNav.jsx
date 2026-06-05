import React, { useState, useRef, useEffect } from "react";
import {
  Search, ChevronDown, User, Heart, ShoppingCart, Menu, X, ArrowRight, Play,
  Laptop, Cpu, Camera, Smartphone, Home, Tv, Headphones, Watch, Fan, Gamepad2, LayoutGrid,
  Truck, ShieldCheck, RefreshCw, Headset, Award, Tag, ChevronRight,
  Globe
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

gsap.registerPlugin(useGSAP);

const DemoNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeSidebarCat, setActiveSidebarCat] = useState("Laptop & Computer");

  // Mobile Menu Specific States
  const [mobileNavView, setMobileNavView] = useState("categories"); // 'menu' or 'categories'
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);

  const categories = ["All Categories", "Electronics", "Laptops", "Cameras", "Smartphones"];
  const navLinks = ["Home", "Products", "PC Builder", "Deals", "New Arrivals", "Brands", "Blogs", "About Us", "Contact Us"];

  const sidebarData = {
    "Laptop & Computer": { icon: Laptop, brands: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Razer"], departments: ["Gaming Laptops", "Ultrabooks", "MacBooks", "Workstations", "Business Laptops"] },
    "Computer Hardware": { icon: Cpu, brands: ["Intel", "AMD", "NVIDIA", "Corsair"], departments: ["CPUs", "GPUs", "Motherboards", "RAM"] },
    "Camera & Photo": { icon: Camera, brands: ["Canon", "Sony", "Nikon"], departments: ["DSLR", "Mirrorless", "Lenses"] },
    "Smartphone & Tablet": { icon: Smartphone, brands: ["Apple", "Samsung", "Google"], departments: ["5G Phones", "Tablets"] },
    "Home & Electronic": { icon: Home, brands: ["Dyson", "Philips"], departments: ["Smart Home", "Lighting"] },
    "TV & Audio": { icon: Tv, brands: ["Sony", "LG", "Samsung"], departments: ["OLED TVs", "Soundbars"] },
    "Headphone & Speaker": { icon: Headphones, brands: ["Bose", "JBL", "Sony"], departments: ["Wireless", "Noise Cancelling"] },
    "Watches & Eyewear": { icon: Watch, brands: ["Apple", "Garmin"], departments: ["Smartwatches", "Fitness"] },
    "Heatsink & Fan": { icon: Fan, brands: ["Noctua", "NZXT"], departments: ["AIO Coolers", "Case Fans"] },
    "Gamepad & Console": { icon: Gamepad2, brands: ["Sony", "Microsoft", "Nintendo"], departments: ["Consoles", "Controllers"] },
    "Digital & Electronic": { icon: LayoutGrid, brands: ["Gadgets"], departments: ["Accessories"] }
  };

  const containerRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [mobileMenuOpen]);

  const handleMouseEnter = contextSafe((e) => {
    const primary = e.currentTarget.querySelector(".nav-primary");
    const secondary = e.currentTarget.querySelector(".nav-secondary");
    if (!primary || !secondary) return;
    gsap.killTweensOf([primary, secondary]);
    gsap.to(primary, { y: "-100%", duration: 0.2, ease: "power1.out" });
    gsap.to(secondary, { y: "-100%", duration: 0.2, ease: "power1.out" });
  });

  const handleMouseLeave = contextSafe((e) => {
    const primary = e.currentTarget.querySelector(".nav-primary");
    const secondary = e.currentTarget.querySelector(".nav-secondary");
    if (!primary || !secondary) return;
    gsap.killTweensOf([primary, secondary]);
    gsap.to(primary, { y: "0%", duration: 0.2, ease: "power1.out" });
    gsap.to(secondary, { y: "0%", duration: 0.2, ease: "power1.out" });
  });

  const toggleMobileCategory = (catName) => {
    if (expandedMobileCat === catName) {
      setExpandedMobileCat(null);
    } else {
      setExpandedMobileCat(catName);
    }
  };

  return (
    <div ref={containerRef} className="w-full bg-white border-b border-gray-100 font-sans antialiased selection:bg-orange-500 selection:text-white relative">

      {/* Desktop Top Utility Bar */}
      <div className="w-full bg-white border-b border-gray-100 text-[13px] text-gray-600 py-2 hidden md:block">
        <div className="container mx-auto px-4 lg:px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Truck size={14} /> Free Shipping on orders over $50</span>
            <span className="flex items-center gap-1.5"><RefreshCw size={14} /> 30-Day Money-Back Guarantee</span>
            <span className="flex items-center gap-1.5"><Headset size={14} /> 24/7 Expert Support</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer hover:text-orange-600 transition-colors font-medium">Track Order</span>
            <span className="cursor-pointer hover:text-orange-600 transition-colors font-medium">Help Center</span>
            <span className="cursor-pointer hover:text-orange-600 transition-colors flex items-center gap-1 font-medium">
              <span><Globe/></span> EN <ChevronDown size={12} />
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6">

        {/* ROW 1: Logo & Actions (Fully Responsive) */}
        <div className="flex items-center justify-between py-4 lg:py-5 gap-4">

          <div className="flex items-center gap-3 lg:gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-xl tracking-tighter">T</div>
              <span className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900 hidden sm:block">
                Tech<span className="text-gray-900/60 font-medium">Hub</span>
              </span>
            </div>
          </div>

          {/* Desktop Search Engine */}
          <div className="hidden lg:flex flex-1 max-w-3xl items-center border border-gray-200 rounded-xl bg-[#F8F9FA] h-12 relative pl-2 mx-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-full px-4 flex items-center gap-2 text-sm text-gray-700 font-medium hover:text-orange-600 transition-colors whitespace-nowrap outline-none">
                <LayoutGrid size={14} className="text-gray-500" />
                {selectedCategory}
                <ChevronDown size={14} className="text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-[100]">
                {categories.map((cat, idx) => (
                  <DropdownMenuItem key={idx} onClick={() => setSelectedCategory(cat)} className="px-4 py-2 text-sm text-gray-600 data-[focused]:bg-orange-50 data-[focused]:text-orange-600 rounded-lg cursor-pointer transition-colors outline-none">
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="h-5 w-[1px] bg-gray-200 self-center"></span>
            <input type="text" placeholder="Search products, brands and categories..." className="w-full bg-transparent px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none" />
            <button className="h-10 bg-black hover:bg-orange-600 transition-colors px-6 text-white rounded-lg flex items-center gap-2 font-medium text-sm mr-1 shadow-sm">
              <Search size={16} />
              <span>Search</span>
            </button>
          </div>

          {/* Account & Cart Actions */}
          <div className="flex items-center gap-3 lg:gap-5">
            <button className="hidden sm:flex items-center gap-2.5 text-left text-gray-700 hover:text-orange-600 transition-colors group">
              <div className="p-2 border border-gray-200 rounded-full bg-white group-hover:bg-orange-50 group-hover:border-orange-200 transition-colors">
                <User size={20} className="group-hover:text-orange-600" />
              </div>
              <div className="hidden lg:block text-xs">
                <p className="text-gray-400 font-normal leading-tight">Account</p>
                <p className="font-semibold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">Sign In</p>
              </div>
            </button>

            <button className="p-2 lg:p-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-all relative group">
              <Heart size={22} className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="absolute top-0.5 right-0.5 lg:top-1 lg:right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white box-content">2</span>
            </button>

            <button className="p-2 lg:p-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-all relative group">
              <ShoppingCart size={22} className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="absolute top-0.5 right-0.5 lg:top-1 lg:right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white box-content">3</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Animated Navigation Links (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-start border-t border-gray-100 py-3 h-12 overflow-hidden">
          <nav className="flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <div key={idx} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative cursor-pointer h-6 overflow-hidden group/link">
                <span className={`nav-primary block text-[14px] font-bold tracking-wide transform will-change-transform ${idx === 0 ? "text-orange-600" : "text-gray-700"}`}>
                  {link}
                  {idx === 0 && <span className="absolute bottom-0 left-0 w-4 h-[2px] bg-orange-600 rounded-full"></span>}
                </span>
                <span className="nav-secondary block text-[14px] font-bold tracking-wide text-orange-600 absolute top-full left-0 transform will-change-transform">{link}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* ROW 3: Sidebar & Hero Block */}
        <div className="flex gap-6 py-6 border-t border-gray-100 items-start">

          {/* Desktop Megamenu Sidebar */}
          <div className="hidden lg:flex w-72 bg-white border border-gray-100 shadow-sm rounded-2xl p-4 relative z-30 group/sidebar flex-shrink-0 h-[510px] flex-col justify-between">
            <div className="space-y-1">
              {Object.entries(sidebarData).map(([item, data], idx) => {
                const Icon = data.icon;
                const isActive = activeSidebarCat === item;
                return (
                  <div key={idx} onMouseEnter={() => setActiveSidebarCat(item)} className={`flex items-center justify-between px-3 py-2 text-[13px] font-semibold rounded-xl cursor-pointer transition-all duration-200 ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'}`}>
                    <span className="flex items-center gap-3">
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 1.75} className={isActive ? "text-orange-600" : "text-gray-400 group-hover:text-orange-500"} />
                      {item}
                    </span>
                    <ArrowRight size={14} className={`transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                  </div>
                )
              })}
            </div>

            {/* Desktop Flyout Panel */}
            <div className="absolute top-0 left-full ml-3 w-[460px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 grid grid-cols-2 gap-6 opacity-0 invisible translate-x-2 group-hover/sidebar:opacity-100 group-hover/sidebar:visible group-hover/sidebar:translate-x-0 transition-all duration-300 backdrop-blur-sm pointer-events-none group-hover/sidebar:pointer-events-auto min-h-[510px]">
              <div>
                <h4 className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-4">Brands</h4>
                <ul className="space-y-3">
                  {sidebarData[activeSidebarCat]?.brands.map((brand, bIdx) => (
                    <li key={bIdx} className="text-[14px] text-gray-600 hover:text-orange-600 transition-colors cursor-pointer font-medium flex items-center justify-between group/item">
                      <span>{brand}</span>
                      <ChevronDown size={12} className="text-gray-300 -rotate-90 group-hover/item:text-orange-500" />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-l border-gray-100 pl-6">
                <h4 className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-4">Departments</h4>
                <ul className="space-y-3">
                  {sidebarData[activeSidebarCat]?.departments.map((dept, dIdx) => (
                    <li key={dIdx} className="text-[14px] text-gray-600 hover:text-orange-600 transition-colors cursor-pointer font-medium flex items-center justify-between group/item">
                      {dept}
                      <ChevronDown size={12} className="text-gray-300 -rotate-90 group-hover/item:text-orange-500" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Layout Canvas Block */}
          <div className="flex-1 w-full flex flex-col gap-4 h-auto lg:h-[510px]">

            <div className="w-full bg-[#0F1115] rounded-3xl p-6 sm:p-8 lg:p-12 text-white h-[320px] lg:h-[360px] flex flex-col justify-between relative overflow-hidden group flex-shrink-0">
              <div className="absolute right-4 bottom-4 w-1/2 h-[90%] hidden md:flex items-center justify-center transition-all duration-500 group-hover:scale-[1.02]">
                <div className="w-full h-full bg-gradient-to-t from-black/40 to-transparent rounded-2xl flex items-center justify-center text-gray-600 text-xs font-mono border border-white/5 relative">
                  <span className="absolute text-center p-4">[ Transparent PNG Product Graphic ]</span>
                </div>
              </div>

              <div className="z-10 max-w-xl">
                <span className="bg-orange-600 text-[10px] lg:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">New Arrival</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-4 lg:mt-5 leading-tight">
                  Powerful Tech.<br />
                  <span className="text-orange-500">Endless Possibilities.</span>
                </h2>
                <p className="text-gray-400 mt-3 lg:mt-4 text-xs sm:text-sm font-normal max-w-xs sm:max-w-sm leading-relaxed hidden sm:block">
                  Explore next-gen laptops and accessories built for speed, performance and style.
                </p>
              </div>

              <div className="z-10 flex items-center gap-4 lg:gap-6 mt-4 sm:mt-0">
                <button className="bg-white text-black text-xs lg:text-sm font-bold px-5 lg:px-7 py-2.5 lg:py-3 rounded-xl hover:bg-orange-600 hover:text-white transition-all flex items-center gap-2 group/btn shadow-md">
                  <span>Shop Now</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button className="hidden sm:flex items-center gap-3 text-sm font-medium text-white hover:text-orange-400 transition-colors">
                  <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"><Play size={14} fill="currentColor" className="ml-0.5" /></span>
                  Watch Video
                </button>
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 flex gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600 cursor-pointer"></span>
                {[1,2,3,4].map(i => <span key={i} className="w-2 h-2 rounded-full bg-white/20 hover:bg-white/50 cursor-pointer transition-colors"></span>)}
              </div>
            </div>

            {/* Sub-Hero Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
              <div className="bg-[#FFF4EE] hover:shadow-md transition-all rounded-2xl p-5 lg:p-6 h-[120px] lg:h-[134px] flex items-center justify-between cursor-pointer group relative overflow-hidden">
                <div className="z-10 flex flex-col justify-between h-full py-0.5">
                  <div>
                    <span className="text-gray-500 text-[10px] lg:text-[11px] font-medium block">Top Deals on</span>
                    <h3 className="font-bold text-[17px] lg:text-[19px] text-gray-900 leading-tight mt-0.5">Smartphones</h3>
                    <p className="text-orange-600 text-xs font-semibold mt-1">Up to 30% Off</p>
                  </div>
                  <button className="bg-orange-600 text-white text-[10px] lg:text-[11px] font-bold px-3 py-1.5 rounded-lg w-20 lg:w-24 hover:bg-orange-700 transition-colors mt-2 shadow-sm">Shop Now</button>
                </div>
                <div className="w-24 lg:w-28 h-full absolute right-2 bottom-0 flex items-center justify-center font-bold text-xs text-orange-200">[Image]</div>
              </div>

              <div className="bg-[#F3F9F6] hover:shadow-md transition-all rounded-2xl p-5 lg:p-6 h-[120px] lg:h-[134px] flex items-center justify-between cursor-pointer group relative overflow-hidden">
                <div className="z-10 flex flex-col justify-between h-full py-0.5">
                  <div>
                    <span className="text-gray-500 text-[10px] lg:text-[11px] font-medium block">Immersive Sound</span>
                    <h3 className="font-bold text-[17px] lg:text-[19px] text-gray-900 leading-tight mt-0.5">Headphones</h3>
                    <p className="text-gray-600 text-xs font-semibold mt-1">From $59.00</p>
                  </div>
                  <button className="bg-black text-white text-[10px] lg:text-[11px] font-bold px-3 py-1.5 rounded-lg w-20 lg:w-24 hover:bg-emerald-600 transition-colors mt-2 shadow-sm">Shop Now</button>
                </div>
                <div className="w-24 lg:w-28 h-full absolute right-2 bottom-0 flex items-center justify-center font-bold text-xs text-emerald-200">[Image]</div>
              </div>

              <div className="bg-[#EEF4FF] hover:shadow-md transition-all rounded-2xl p-5 lg:p-6 h-[120px] lg:h-[134px] sm:col-span-2 xl:col-span-1 flex items-center justify-between cursor-pointer group relative overflow-hidden">
                <div className="z-10 flex flex-col justify-between h-full py-0.5">
                  <div>
                    <span className="text-gray-500 text-[10px] lg:text-[11px] font-medium block">Smart Living</span>
                    <h3 className="font-bold text-[17px] lg:text-[19px] text-gray-900 leading-tight mt-0.5">Wearables</h3>
                    <p className="text-blue-600 text-xs font-semibold mt-1">Up to 25% Off</p>
                  </div>
                  <button className="bg-blue-600 text-white text-[10px] lg:text-[11px] font-bold px-3 py-1.5 rounded-lg w-20 lg:w-24 hover:bg-blue-700 transition-colors mt-2 shadow-sm">Shop Now</button>
                </div>
                <div className="w-24 lg:w-28 h-full absolute right-2 bottom-0 flex items-center justify-center font-bold text-xs text-blue-200">[Image]</div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: Bottom Store Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 py-8 lg:py-10 mt-2 border-t border-gray-100">
          <div className="flex items-start gap-3 lg:gap-4"><Truck className="text-gray-400 mt-1" size={24} strokeWidth={1.5} /><div><h4 className="text-[13px] lg:text-[14px] font-bold text-gray-900 leading-tight">Free Shipping</h4><p className="text-[11px] lg:text-[12px] text-gray-500 mt-0.5 lg:mt-1">On orders over $50</p></div></div>
          <div className="flex items-start gap-3 lg:gap-4"><ShieldCheck className="text-gray-400 mt-1" size={24} strokeWidth={1.5} /><div><h4 className="text-[13px] lg:text-[14px] font-bold text-gray-900 leading-tight">Secure Payment</h4><p className="text-[11px] lg:text-[12px] text-gray-500 mt-0.5 lg:mt-1">100% secure checkout</p></div></div>
          <div className="flex items-start gap-3 lg:gap-4"><RefreshCw className="text-gray-400 mt-1" size={24} strokeWidth={1.5} /><div><h4 className="text-[13px] lg:text-[14px] font-bold text-gray-900 leading-tight">Easy Returns</h4><p className="text-[11px] lg:text-[12px] text-gray-500 mt-0.5 lg:mt-1">30 days return policy</p></div></div>
          <div className="flex items-start gap-3 lg:gap-4 hidden md:flex"><Headset className="text-gray-400 mt-1" size={24} strokeWidth={1.5} /><div><h4 className="text-[13px] lg:text-[14px] font-bold text-gray-900 leading-tight">24/7 Support</h4><p className="text-[11px] lg:text-[12px] text-gray-500 mt-0.5 lg:mt-1">Dedicated support</p></div></div>
          <div className="flex items-start gap-3 lg:gap-4 hidden lg:flex"><Award className="text-gray-400 mt-1" size={24} strokeWidth={1.5} /><div><h4 className="text-[13px] lg:text-[14px] font-bold text-gray-900 leading-tight">Trusted Store</h4><p className="text-[11px] lg:text-[12px] text-gray-500 mt-0.5 lg:mt-1">100% verified seller</p></div></div>
          <div className="flex items-start gap-3 lg:gap-4 hidden lg:flex"><Tag className="text-gray-400 mt-1" size={24} strokeWidth={1.5} /><div><h4 className="text-[13px] lg:text-[14px] font-bold text-gray-900 leading-tight">Exclusive Offers</h4><p className="text-[11px] lg:text-[12px] text-gray-500 mt-0.5 lg:mt-1">Save more every day</p></div></div>
        </div>
      </div>

      {/* =========================================================================
          THE NEW MOBILE DRAWER (Shadcn-Style Slide-over implementation)
         ========================================================================= */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-[360px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Mobile Drawer Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black rounded flex items-center justify-center text-white font-black text-lg">T</div>
              <span className="text-xl font-bold tracking-tight text-gray-900">TechHub</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full text-[14px] bg-transparent outline-none placeholder:text-gray-400 text-gray-800"
              />
            </div>
          </div>

          {/* View Toggles (Menu vs Categories) */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setMobileNavView('categories')}
              className={`flex-1 py-3 text-[14px] font-bold text-center transition-colors border-b-2 ${mobileNavView === 'categories' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              Categories
            </button>
            <button
              onClick={() => setMobileNavView('menu')}
              className={`flex-1 py-3 text-[14px] font-bold text-center transition-colors border-b-2 ${mobileNavView === 'menu' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              Main Menu
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto bg-white pb-6">

            {/* Nav View: Categories (The Accordion Implementation) */}
            {mobileNavView === 'categories' && (
              <div className="flex flex-col">
                {Object.entries(sidebarData).map(([item, data], idx) => {
                  const Icon = data.icon;
                  const isExpanded = expandedMobileCat === item;

                  return (
                    <div key={idx} className="border-b border-gray-50">
                      <button
                        onClick={() => toggleMobileCategory(item)}
                        className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${isExpanded ? 'bg-orange-50/50' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} strokeWidth={isExpanded ? 2.5 : 1.75} className={isExpanded ? "text-orange-600" : "text-gray-500"} />
                          <span className={`text-[14px] font-semibold ${isExpanded ? 'text-orange-600' : 'text-gray-700'}`}>{item}</span>
                        </div>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isExpanded ? '-rotate-180 text-orange-500' : ''}`} />
                      </button>

                      {/* Accordion Content via CSS Grid transition */}
                      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="px-5 pb-4 pt-1 bg-orange-50/20">
                            <div className="mb-4">
                              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2 ml-8">Brands</h5>
                              <ul className="space-y-2 ml-8 border-l-2 border-gray-100 pl-3">
                                {data.brands.map((brand, bIdx) => (
                                  <li key={bIdx} className="text-[13px] text-gray-600 font-medium py-1">{brand}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-8">Departments</h5>
                              <ul className="space-y-2 ml-8 border-l-2 border-gray-100 pl-3">
                                {data.departments.map((dept, dIdx) => (
                                  <li key={dIdx} className="text-[13px] text-gray-600 font-medium py-1">{dept}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Nav View: Main Menu (Basic Links) */}
            {mobileNavView === 'menu' && (
              <div className="flex flex-col py-2">
                {navLinks.map((link, idx) => (
                  <a key={idx} href="#" className="px-5 py-3.5 text-[15px] font-semibold text-gray-700 hover:text-orange-600 hover:bg-gray-50 border-b border-gray-50 transition-colors flex justify-between items-center">
                    {link}
                    <ChevronRight size={16} className="text-gray-300" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer (User & Utilities) */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-4">
            <button className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-bold text-[14px] hover:bg-orange-600 transition-colors shadow-sm">
              <User size={18} />
              Sign In / Register
            </button>
            <div className="flex justify-center gap-6 text-[12px] font-semibold text-gray-500">
              <span className="cursor-pointer hover:text-orange-600">Help Center</span>
              <span>|</span>
              <span className="cursor-pointer hover:text-orange-600">Track Order</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoNav;
