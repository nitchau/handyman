import { Clock, HardHat, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BomProject } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const DIFFICULTY_CONFIG = {
  easy: {
    label: "Easy",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  moderate: {
    label: "Moderate",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  hard: {
    label: "Hard",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

interface LaborCardProps {
  project: BomProject;
}

export function LaborCard({ project }: LaborCardProps) {
  const diff = DIFFICULTY_CONFIG[project.difficulty];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <HardHat className="size-5 text-slate-500" />
          <CardTitle>Labor Estimate</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <Clock className="size-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Time Estimate</p>
              <p className="font-semibold text-slate-800">
                {project.labor_hours_min}–{project.labor_hours_max} hours
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <Users className="size-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Hire a Pro</p>
              <p className="font-semibold text-slate-800">
                {formatCurrency(project.labor_cost_min)}–
                {formatCurrency(project.labor_cost_max)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <HardHat className="size-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Difficulty</p>
              <span
                className={cn(
                  "inline-block rounded-full border px-2 py-0.5 text-xs font-medium",
                  diff.className
                )}
              >
                {diff.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1">
            DIY — Save {formatCurrency(project.labor_cost_min)}+
          </Button>
          <Button variant="outline" className="flex-1">
            Find a Contractor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
