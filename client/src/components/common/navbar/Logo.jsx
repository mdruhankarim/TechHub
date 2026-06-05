// Logo.jsx

import { Link } from "react-router-dom";

import logo from "@/assets/Logo.png";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition"
    >
      <div className="w-24">
        <img src={logo} alt="TechHub Logo" className="w-full object-cover" />
      </div>

      <span className="text-xl font-bold tracking-tight text-gray-900">
        TechHub
      </span>
    </Link>
  );
}
