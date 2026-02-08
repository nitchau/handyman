import { Lightbulb } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function PlanPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Plan Your Project
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Upload photos and let AI create your project plan, materials list, and cost estimate.
        </p>
      </div>
      <EmptyState
        icon={Lightbulb}
        title="AI Project Planner coming soon"
        description="Upload a photo of your project area and get an AI-generated plan with materials and cost estimates."
      />
    </div>
  );
}
