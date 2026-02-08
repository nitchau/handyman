import { BadgeCheck, CreditCard, Shield, HeadphonesIcon } from "lucide-react";

const trustItems = [
  { icon: <BadgeCheck className="size-5" />, label: "Verified Contractors" },
  { icon: <CreditCard className="size-5" />, label: "Price Transparency" },
  { icon: <Shield className="size-5" />, label: "Guaranteed Quality" },
  { icon: <HeadphonesIcon className="size-5" />, label: "Expert Support" },
];

export function TrustStrip() {
  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-8">
        {trustItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
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
