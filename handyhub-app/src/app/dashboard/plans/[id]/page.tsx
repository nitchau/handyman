"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useBomStore } from "@/stores/bom-store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DisclaimerBanner } from "@/components/plan/results/disclaimer-banner";
import { ProjectSummaryCard } from "@/components/plan/results/project-summary-card";
import { MaterialsTable } from "@/components/plan/results/materials-table";
import { ToolsCard } from "@/components/plan/results/tools-card";
import { LaborCard } from "@/components/plan/results/labor-card";
import { ProVerificationCta } from "@/components/plan/results/pro-verification-cta";

export default function PlanResultPage() {
  const router = useRouter();
  const { result } = useBomStore();

  if (!result) {
    return (
      <div className="space-y-6">
        <EmptyState
          title="Plan not found"
          description="This plan doesn't exist or hasn't been generated yet."
          actionLabel="Create a Plan"
          actionHref="/plan"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/plans")}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Project Plan
        </h1>
      </div>

      <DisclaimerBanner
        referenceDetected={result.reference_object_detected}
        confidenceScore={result.confidence_score}
      />
      <ProjectSummaryCard project={result} />
      <MaterialsTable items={result.items} tasks={result.tasks} />
      <ToolsCard tools={result.tools} />
      <LaborCard project={result} />
      <ProVerificationCta />
    </div>
  );
}
