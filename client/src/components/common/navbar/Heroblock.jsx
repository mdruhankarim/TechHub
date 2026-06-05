import React from "react";
import { ArrowRight, Play } from "lucide-react";

const HeroBanner = () => (
  <div className="w-full bg-[#0F1115] rounded-3xl p-6 sm:p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden group flex-shrink-0 min-h-[280px] lg:min-h-[340px]">
    {/* Product graphic placeholder */}
    <div className="absolute right-4 bottom-4 w-1/2 h-[90%] hidden md:flex items-center justify-center transition-all duration-500 group-hover:scale-[1.02]">
      <div className="w-full h-full bg-gradient-to-t from-black/40 to-transparent rounded-2xl flex items-center justify-center text-gray-600 text-xs font-mono border border-white/5 relative">
        <span className="absolute text-center p-4">[ Transparent PNG Product Graphic ]</span>
      </div>
    </div>

    {/* Copy */}
    <div className="z-10 max-w-xl">
      <span className="bg-orange-600 text-[10px] lg:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
        New Arrival
      </span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-4 lg:mt-5 leading-tight">
        Powerful Tech.<br />
        <span className="text-orange-500">Endless Possibilities.</span>
      </h2>
      <p className="text-gray-400 mt-3 lg:mt-4 text-xs sm:text-sm font-normal max-w-xs sm:max-w-sm leading-relaxed hidden sm:block">
        Explore next-gen laptops and accessories built for speed, performance and style.
      </p>
    </div>

    {/* CTAs */}
    <div className="z-10 flex items-center gap-4 lg:gap-6 mt-6 sm:mt-8">
      <button className="bg-white text-black text-xs lg:text-sm font-bold px-5 lg:px-7 py-2.5 lg:py-3 rounded-xl hover:bg-orange-600 hover:text-white transition-all flex items-center gap-2 group/btn shadow-md">
        <span>Shop Now</span>
        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
      <button className="hidden sm:flex items-center gap-3 text-sm font-medium text-white hover:text-orange-400 transition-colors">
        <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
          <Play size={14} fill="currentColor" className="ml-0.5" />
        </span>
        Watch Video
      </button>
    </div>

    {/* Slider dots */}
    <div className="flex gap-2 mt-6 lg:mt-8">
      <span className="w-2 h-2 rounded-full bg-orange-600 cursor-pointer" />
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-white/20 hover:bg-white/50 cursor-pointer transition-colors"
        />
      ))}
    </div>
  </div>
);

const SubHeroBanners = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {/* Smartphones */}
    <div className="bg-[#FFF4EE] hover:shadow-md transition-all rounded-2xl p-5 lg:p-6 min-h-[120px] flex items-center justify-between cursor-pointer group relative overflow-hidden">
      <div className="z-10 flex flex-col justify-between h-full py-0.5">
        <div>
          <span className="text-gray-500 text-[10px] lg:text-[11px] font-medium block">Top Deals on</span>
          <h3 className="font-bold text-[17px] lg:text-[19px] text-gray-900 leading-tight mt-0.5">Smartphones</h3>
          <p className="text-orange-600 text-xs font-semibold mt-1">Up to 30% Off</p>
        </div>
        <button className="bg-orange-600 text-white text-[10px] lg:text-[11px] font-bold px-3 py-1.5 rounded-lg w-20 lg:w-24 hover:bg-orange-700 transition-colors mt-2 shadow-sm">
          Shop Now
        </button>
      </div>
      <div className="w-24 lg:w-28 h-full absolute right-2 bottom-0 flex items-center justify-center font-bold text-xs text-orange-200">
        [Image]
      </div>
    </div>

    {/* Headphones */}
    <div className="bg-[#F3F9F6] hover:shadow-md transition-all rounded-2xl p-5 lg:p-6 min-h-[120px] flex items-center justify-between cursor-pointer group relative overflow-hidden">
      <div className="z-10 flex flex-col justify-between h-full py-0.5">
        <div>
          <span className="text-gray-500 text-[10px] lg:text-[11px] font-medium block">Immersive Sound</span>
          <h3 className="font-bold text-[17px] lg:text-[19px] text-gray-900 leading-tight mt-0.5">Headphones</h3>
          <p className="text-gray-600 text-xs font-semibold mt-1">From $59.00</p>
        </div>
        <button className="bg-black text-white text-[10px] lg:text-[11px] font-bold px-3 py-1.5 rounded-lg w-20 lg:w-24 hover:bg-emerald-600 transition-colors mt-2 shadow-sm">
          Shop Now
        </button>
      </div>
      <div className="w-24 lg:w-28 h-full absolute right-2 bottom-0 flex items-center justify-center font-bold text-xs text-emerald-200">
        [Image]
      </div>
    </div>

    {/* Wearables */}
    <div className="bg-[#EEF4FF] hover:shadow-md transition-all rounded-2xl p-5 lg:p-6 min-h-[120px] sm:col-span-2 xl:col-span-1 flex items-center justify-between cursor-pointer group relative overflow-hidden">
      <div className="z-10 flex flex-col justify-between h-full py-0.5">
        <div>
          <span className="text-gray-500 text-[10px] lg:text-[11px] font-medium block">Smart Living</span>
          <h3 className="font-bold text-[17px] lg:text-[19px] text-gray-900 leading-tight mt-0.5">Wearables</h3>
          <p className="text-blue-600 text-xs font-semibold mt-1">Up to 25% Off</p>
        </div>
        <button className="bg-blue-600 text-white text-[10px] lg:text-[11px] font-bold px-3 py-1.5 rounded-lg w-20 lg:w-24 hover:bg-blue-700 transition-colors mt-2 shadow-sm">
          Shop Now
        </button>
      </div>
      <div className="w-24 lg:w-28 h-full absolute right-2 bottom-0 flex items-center justify-center font-bold text-xs text-blue-200">
        [Image]
      </div>
    </div>
  </div>
);

const HeroBlock = () => (
  <div className="flex-1 w-full min-w-0 flex flex-col gap-4">
    <HeroBanner />
    <SubHeroBanners />
  </div>
);

export default HeroBlock;
