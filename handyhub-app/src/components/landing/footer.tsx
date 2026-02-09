"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";

export function Footer() {
  const { t } = useTranslation();

  const footerSections = [
    {
      heading: t("footer.platform"),
      links: [
        { label: t("footer.platform.designIdeas"), href: "/designs" },
        { label: t("footer.platform.findContractors"), href: "/contractors" },
        { label: t("footer.platform.toolRentals"), href: "/tools" },
        { label: t("footer.platform.howItWorks"), href: "#" },
        { label: t("footer.platform.aiPlanner"), href: "#" },
      ],
    },
    {
      heading: t("footer.forPros"),
      links: [
        { label: t("footer.forPros.findWork"), href: "#" },
        { label: t("footer.forPros.verification"), href: "#" },
        { label: t("footer.forPros.escrowPayments"), href: "#" },
      ],
    },
    {
      heading: t("footer.company"),
      links: [
        { label: t("footer.company.about"), href: "#" },
        { label: t("footer.company.blog"), href: "#" },
        { label: t("footer.company.careers"), href: "#" },
        { label: t("footer.company.contact"), href: "#" },
      ],
    },
    {
      heading: t("footer.legal"),
      links: [
        { label: t("footer.legal.privacy"), href: "#" },
        { label: t("footer.legal.terms"), href: "#" },
        { label: t("footer.legal.cookies"), href: "#" },
      ],
    },
  ];

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
              {t("footer.tagline")}
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.heading}>
              <h4 className="text-sm font-semibold text-slate-800">
                {section.heading}
              </h4>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
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
          &copy; {new Date().getFullYear()} {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
