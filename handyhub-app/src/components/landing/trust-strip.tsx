"use client";

import { BadgeCheck, CreditCard, Shield, HeadphonesIcon } from "lucide-react";
import { useTranslation } from "@/lib/i18n/language-context";

export function TrustStrip() {
  const { t } = useTranslation();

  const trustItems = [
    { icon: <BadgeCheck className="size-5" />, label: t("trust.verifiedContractors") },
    { icon: <CreditCard className="size-5" />, label: t("trust.priceTransparency") },
    { icon: <Shield className="size-5" />, label: t("trust.guaranteedQuality") },
    { icon: <HeadphonesIcon className="size-5" />, label: t("trust.expertSupport") },
  ];

  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-8">
        {trustItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-primary">{item.icon}</span>
            <span className="text-sm font-bold uppercase tracking-widest text-slate-600">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
