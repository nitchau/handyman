import { CheckCircle2 } from "lucide-react";

const trustItems = [
  "Verified contractors available",
  "Escrow-protected payments",
  "AI-powered price comparison",
  "100% free platform",
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
        {trustItems.map((item) => (
          <div key={item} className="flex items-center gap-2.5">
            <CheckCircle2 className="size-5 shrink-0 text-primary" />
            <span className="text-sm font-medium text-slate-600">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
