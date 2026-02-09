"use client";

import { Home } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "@/lib/i18n/language-context";

export default function ForHomeownersPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          {t("forHomeowners.title")}
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          {t("forHomeowners.subtitle")}
        </p>
      </div>
      <div className="mt-12">
        <EmptyState
          icon={Home}
          title={t("forHomeowners.comingSoon")}
          description={t("forHomeowners.description")}
          actionLabel={t("forHomeowners.cta")}
          actionHref="/onboarding"
        />
      </div>
    </div>
  );
}
