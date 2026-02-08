import { Home } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Design Ideas", href: "/designs" },
    { label: "How It Works", href: "#" },
    { label: "Price Comparison", href: "#" },
    { label: "Tool Rentals", href: "#" },
    { label: "AI Project Planner", href: "#" },
  ],
  "For Pros": [
    { label: "Find Work", href: "#" },
    { label: "Verification", href: "#" },
    { label: "Escrow Payments", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Home className="size-5 text-primary" />
              <span className="text-lg font-bold text-primary">HandyHub</span>
            </Link>
            <p className="mt-3 text-sm text-slate-500">
              Every home project starts here.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-slate-800">
                {heading}
              </h4>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} HandyHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
