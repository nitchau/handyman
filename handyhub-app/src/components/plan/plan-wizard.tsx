"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useBomStore } from "@/stores/bom-store";
import { StepProgress } from "@/components/ui/step-progress";
import { CategoryStep } from "@/components/plan/category-step";
import { MediaStep } from "@/components/plan/media-step";
import { AnalysisStep } from "@/components/plan/analysis-step";
import { PreferencesStep } from "@/components/plan/preferences-step";
import { PreviewStep } from "@/components/plan/preview-step";
import { DesignReferenceBanner } from "@/components/plan/design-reference-banner";
import { useTranslation } from "@/lib/i18n/language-context";
import {
  mapRoomToSpace,
  mapRoomToCategory,
  buildDesignDescription,
} from "@/lib/design-to-bom-mapping";
import type { DesignIdea } from "@/types/database";

export function PlanWizard() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const { currentStep, designReference, setProjectData, setDesignReference, reset } = useBomStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(!!ref);

  useEffect(() => {
    if (!ref) {
      // No design reference — reset any stale state
      reset();
      return;
    }

    let cancelled = false;

    async function loadDesign() {
      try {
        const res = await fetch(`/api/designs/${ref}`);
        if (!res.ok || cancelled) return;
        const { data } = (await res.json()) as { data: DesignIdea };
        if (cancelled || !data) return;

        // Pre-fill project data
        setProjectData({
          category_slug: mapRoomToCategory(data.room_type),
          space_type: mapRoomToSpace(data.room_type),
          description: buildDesignDescription(data),
        });

        // Set design reference for banner + analysis step
        setDesignReference({
          designId: data.id,
          designTitle: data.title,
          designStyle: data.style,
          roomType: data.room_type,
          budgetTier: data.budget_tier,
          estimatedCost: data.estimated_cost,
          primaryPhotoUrl: data.primary_photo_url,
          mediaUrls: data.media_urls,
          designerId: data.designer_id,
          designerName: data.designer?.display_name ?? "Designer",
          productTags: data.product_tags.map((tag) => ({
            productName: tag.product_name,
            productBrand: tag.product_brand,
            productCategory: tag.product_category,
            estimatedPrice: tag.estimated_price,
            retailerName: tag.retailer_name,
            quantityNeeded: tag.quantity_needed,
          })),
        });
      } catch {
        // Silently fall back to normal wizard flow
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDesign();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const STEPS = [
    { label: t("plan.stepDetails") },
    { label: t("plan.stepPhotos") },
    { label: t("plan.stepAnalysis") },
    { label: t("plan.stepPreferences") },
    { label: t("plan.stepPreview") },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {designReference && <DesignReferenceBanner />}
      <StepProgress steps={STEPS} currentStep={currentStep} />

      {currentStep === 0 && <CategoryStep />}
      {currentStep === 1 && <MediaStep />}
      {currentStep === 2 && <AnalysisStep />}
      {currentStep === 3 && <PreferencesStep />}
      {currentStep === 4 && <PreviewStep />}
    </div>
  );
}
