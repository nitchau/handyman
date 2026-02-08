"use client";

import { useBomStore } from "@/stores/bom-store";
import { StepProgress } from "@/components/ui/step-progress";
import { CategoryStep } from "@/components/plan/category-step";
import { MediaStep } from "@/components/plan/media-step";
import { AnalysisStep } from "@/components/plan/analysis-step";

const STEPS = [
  { label: "Details" },
  { label: "Photos" },
  { label: "Analysis" },
];

export function PlanWizard() {
  const { currentStep } = useBomStore();

  return (
    <div className="space-y-8">
      <StepProgress steps={STEPS} currentStep={currentStep} />

      {currentStep === 0 && <CategoryStep />}
      {currentStep === 1 && <MediaStep />}
      {currentStep === 2 && <AnalysisStep />}
    </div>
  );
}
