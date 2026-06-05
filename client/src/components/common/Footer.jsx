import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScanFace } from "lucide-react";

const footerSections = [
  {
    title: "Shop",
    links: ["Laptops", "Phones", "Audio", "Accessories"],
  },
  {
    title: "Customer Service",
    links: ["Contact Us", "Shipping & Delivery", "Returns", "FAQ"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Privacy Policy"],
  },
  {
    title: "Support",
    links: ["Help Center", "Terms & Conditions"],
  },
];

const socialLinks = [
  { icon: ScanFace, label: "Facebook" },
  { icon: ScanFace, label: "Twitter" },
  { icon: ScanFace, label: "Instagram" },
  { icon: ScanFace, label: "YouTube" },
  { icon: ScanFace, label: "LinkedIn" },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link}>
            <button className="text-sm text-gray-400 transition-colors hover:text-white">
              {link}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon: Icon, label }) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-all hover:border-orange-500/50 hover:text-white"
    >
      <Icon size={16} />
    </button>
  );
}

function PaymentBadge({ children }) {
  return (
    <div className="text-sm font-medium tracking-wide text-white/90">
      {children}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#0B0D12] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="border-b border-white/10 py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-xl font-semibold sm:text-2xl">
                Get the latest updates and offers
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Subscribe to our newsletter for exclusive news and special
                deals.
              </p>
            </div>

            <form className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-11 min-w-[280px] border-white/10 bg-white text-black placeholder:text-gray-500 focus-visible:ring-orange-500"
              />
              <Button className="h-11 rounded-md bg-orange-500 px-6 font-medium text-white hover:bg-orange-600">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer */}
        <div className="grid gap-10 py-10 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="text-lg font-bold tracking-tight">TechHub</div>
            </div>

            <p className="max-w-xs text-sm leading-6 text-gray-400">
              Your one-stop shop for the latest tech gadgets.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <SocialIcon
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <FooterColumn
              key={section.title}
              title={section.title}
              links={section.links}
            />
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>© 2024 TechHub. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <PaymentBadge>VISA</PaymentBadge>
            <PaymentBadge>Mastercard</PaymentBadge>
            <PaymentBadge>PayPal</PaymentBadge>
            <PaymentBadge>Apple Pay</PaymentBadge>
          </div>
        </div>
      </div>
    </footer>
  );
}
