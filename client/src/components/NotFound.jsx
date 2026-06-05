import React from "react";
import { useNavigate } from "react-router-dom";
import NotoFound from "@/assets/NotFound.png";

const Button = ({ children, className, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50 bg-[#000000] text-white hover:bg-[#111827]
    h-11 px-7 select-none active:scale-[0.98] cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] lg:min-h-screen bg-[#F9FAFB] flex items-center justify-center font-sans antialiased overflow-hidden py-12 md:py-20">
      {/* Outer wrapper matching TechHub Design System's 1280px container max-width */}
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        {/* Left Typography Block */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 md:space-y-6 order-2 lg:order-1 z-10">
          <h1 className="text-[#000000] font-bold text-7xl md:text-8xl lg:text-[96px] leading-none tracking-tighter">
            404
          </h1>

          <div className="space-y-3">
            <h2 className="text-[#111827] font-bold text-2xl md:text-3xl lg:text-[32px] leading-tight tracking-tight">
              Page Not Found
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-sm leading-relaxed">
              Sorry, the page you're looking for doesn't exist.
            </p>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => navigate("/")}
              className="font-medium tracking-wide shadow-sm hover:shadow-md"
            >
              Go Home
            </Button>
          </div>
        </div>

        {/* Right Image Block - Expanded & Optimized */}
        <div className="lg:col-span-7 flex items-center justify-center lg:justify-end select-none order-1 lg:order-2 w-full px-2 sm:px-8 lg:px-0">
          {/* Custom micro-animation loop: ultra-smooth floating effect */}
          <div className="w-full max-w-[540px] lg:max-w-[620px] flex items-center justify-center animate-[float_5s_ease-in-out_infinite]">
            <img
              src={NotoFound}
              alt="404 Error Exploration Artwork"
              className="w-full h-auto object-contain max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
            />
          </div>
        </div>
      </div>

      {/* Embedded style tag to support the buttery-smooth custom floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(0.5deg); }
        }
      `}</style>
    </div>
  );
}
