"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/language-context";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
          <span className="text-xs font-bold uppercase tracking-widest">
            {t("hero.badge")}
          </span>
        </div>
        <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-7xl">
          {t("hero.title1")}{" "}
          <br />
          <span className="text-primary">{t("hero.title2")}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
          {t("hero.subtitle")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/plan">
            <Button size="lg" className="px-10 py-4 text-lg font-bold shadow-xl shadow-primary/30">
              {t("hero.startProject")}
            </Button>
          </Link>
          <Link href="/designs">
            <Button
              variant="outline"
              size="lg"
              className="px-10 py-4 text-lg font-bold"
            >
              {t("hero.viewInspiration")}
            </Button>
          </Link>
        </div>
      </div>
      {/* Abstract background shape */}
      <div className="absolute -right-40 -top-40 -z-0 opacity-10">
        <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="400" fill="url(#heroGrad)" />
          <defs>
            <radialGradient id="heroGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 400) rotate(90) scale(400)">
              <stop stopColor="#059669" />
              <stop offset="1" stopColor="#059669" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
