"use client";

import { useBomStore } from "@/stores/bom-store";
import { StepProgress } from "@/components/ui/step-progress";
import { CategoryStep } from "@/components/plan/category-step";
import { MediaStep } from "@/components/plan/media-step";
import { AnalysisStep } from "@/components/plan/analysis-step";
import { PreviewStep } from "@/components/plan/preview-step";
import { useTranslation } from "@/lib/i18n/language-context";

export function PlanWizard() {
  const { currentStep } = useBomStore();
  const { t } = useTranslation();

  const STEPS = [
    { label: t("plan.stepDetails") },
    { label: t("plan.stepPhotos") },
    { label: t("plan.stepAnalysis") },
    { label: t("plan.stepPreview") },
  ];

  return (
    <div className="space-y-8">
      <StepProgress steps={STEPS} currentStep={currentStep} />

      {currentStep === 0 && <CategoryStep />}
      {currentStep === 1 && <MediaStep />}
      {currentStep === 2 && <AnalysisStep />}
      {currentStep === 3 && <PreviewStep />}
    </div>
  );
}
