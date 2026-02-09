"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useBomStore } from "@/stores/bom-store";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/language-context";

export function DesignReferenceBanner() {
  const { designReference, setDesignReference } = useBomStore();
  const { t } = useTranslation();

  if (!designReference) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
      <Image
        src={designReference.primaryPhotoUrl}
        alt={designReference.designTitle}
        width={56}
        height={56}
        className="size-14 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <Badge variant="secondary" className="mb-1 bg-emerald-100 text-emerald-700 text-xs">
          {t("plan.designRef.badge")}
        </Badge>
        <p className="truncate text-sm font-medium text-slate-800">
          {designReference.designTitle}
        </p>
        <p className="text-xs text-slate-500">
          {t("plan.designRef.by")} {designReference.designerName}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDesignReference(null)}
        className="flex size-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
