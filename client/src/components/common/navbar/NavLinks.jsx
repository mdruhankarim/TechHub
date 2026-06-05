// NavLinks.jsx

import { Link } from "react-router-dom";

export const navLinks = [
  { label: "Laptops", href: "#" },
  { label: "Phones", href: "#" },
  { label: "Audio", href: "#" },
  { label: "Accessories", href: "#" },
];

export default function NavLinks() {
  return (
    <nav className="hidden lg:flex items-center gap-5">
      {navLinks.map((link) => (
        <Link
          key={link.label}
          to={link.href}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
