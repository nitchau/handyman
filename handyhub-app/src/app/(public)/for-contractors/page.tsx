"use client";

import { HardHat } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "@/lib/i18n/language-context";

export default function ForContractorsPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          {t("forContractors.title")}
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          {t("forContractors.subtitle")}
        </p>
      </div>
      <div className="mt-12">
        <EmptyState
          icon={HardHat}
          title={t("forContractors.comingSoon")}
          description={t("forContractors.description")}
          actionLabel={t("forContractors.cta")}
          actionHref="/onboarding"
        />
      </div>
    </div>
  );
}
