import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PlanWizard } from "@/components/plan/plan-wizard";

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <PlanWizard />
    </Suspense>
  );
}
