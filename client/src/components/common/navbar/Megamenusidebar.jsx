import React from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { SIDEBAR_DATA } from "./NavData";

const MegaMenuSidebar = ({ activeCat, onCatHover }) => (
  <div className="hidden lg:flex w-72 bg-white border border-gray-100 shadow-sm rounded-2xl p-4 relative z-30 group/sidebar flex-shrink-0 flex-col justify-between self-stretch">
    {/* Sidebar Category List */}
    <div className="space-y-1">
      {Object.entries(SIDEBAR_DATA).map(([item, data], idx) => {
        const Icon = data.icon;
        const isActive = activeCat === item;
        return (
          <div
            key={idx}
            onMouseEnter={() => onCatHover(item)}
            className={`flex items-center justify-between px-3 py-2 text-[13px] font-semibold rounded-xl cursor-pointer transition-all duration-200 ${
              isActive
                ? "bg-orange-50 text-orange-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-orange-600"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 1.75}
                className={isActive ? "text-orange-600" : "text-gray-400"}
              />
              {item}
            </span>
            <ArrowRight
              size={14}
              className={`transition-all duration-300 ${
                isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              }`}
            />
          </div>
        );
      })}
    </div>

    {/* Flyout Panel */}
    <div className="absolute top-0 left-full ml-3 w-[460px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 grid grid-cols-2 gap-6 opacity-0 invisible translate-x-2 group-hover/sidebar:opacity-100 group-hover/sidebar:visible group-hover/sidebar:translate-x-0 transition-all duration-300 backdrop-blur-sm pointer-events-none group-hover/sidebar:pointer-events-auto">
      <div>
        <h4 className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-4">
          Brands
        </h4>
        <ul className="space-y-3">
          {SIDEBAR_DATA[activeCat]?.brands.map((brand, bIdx) => (
            <li
              key={bIdx}
              className="text-[14px] text-gray-600 hover:text-orange-600 transition-colors cursor-pointer font-medium flex items-center justify-between group/item"
            >
              <span>{brand}</span>
              <ChevronDown
                size={12}
                className="text-gray-300 -rotate-90 group-hover/item:text-orange-500"
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="border-l border-gray-100 pl-6">
        <h4 className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-4">
          Departments
        </h4>
        <ul className="space-y-3">
          {SIDEBAR_DATA[activeCat]?.departments.map((dept, dIdx) => (
            <li
              key={dIdx}
              className="text-[14px] text-gray-600 hover:text-orange-600 transition-colors cursor-pointer font-medium flex items-center justify-between group/item"
            >
              {dept}
              <ChevronDown
                size={12}
                className="text-gray-300 -rotate-90 group-hover/item:text-orange-500"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default MegaMenuSidebar;
