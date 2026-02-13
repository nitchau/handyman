import { CheckCircle, DollarSign, Package, Ruler, Wrench } from "lucide-react";
import type { BomProject } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfidenceBadge } from "./confidence-badge";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function getItemQty(item: { quantity_with_waste?: number; quantity: number }) {
  return item.quantity_with_waste ?? item.quantity;
}

function getLowestTotal(project: BomProject) {
  return project.items.reduce((sum, item) => {
    const lowest = Math.min(...item.prices.map((p) => p.price));
    return sum + lowest * getItemQty(item);
  }, 0);
}

function getHighestTotal(project: BomProject) {
  return project.items.reduce((sum, item) => {
    const highest = Math.max(...item.prices.map((p) => p.price));
    return sum + highest * getItemQty(item);
  }, 0);
}

interface ProjectSummaryCardProps {
  project: BomProject;
}

export function ProjectSummaryCard({ project }: ProjectSummaryCardProps) {
  const materialLow = getLowestTotal(project);
  const materialHigh = getHighestTotal(project);
  const totalLow = materialLow + project.labor_cost_min;
  const totalHigh = materialHigh + project.labor_cost_max;

  const stats = [
    {
      icon: Package,
      label: "Materials",
      value: `${project.items.length} items`,
    },
    {
      icon: Wrench,
      label: "Tools",
      value: `${project.tools.length} required`,
    },
    {
      icon: Ruler,
      label: "Difficulty",
      value: project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1),
    },
    {
      icon: DollarSign,
      label: "Materials Cost",
      value: `${formatCurrency(materialLow)} – ${formatCurrency(materialHigh)}`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">{project.title}</CardTitle>
            {project.reference_object_detected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                <CheckCircle className="size-3" />
                Reference detected
              </span>
            )}
          </div>
          <ConfidenceBadge
            tier={project.confidence_tier}
            score={project.confidence_score}
          />
        </div>
        <p className="text-sm text-slate-500">{project.description}</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-white text-slate-500">
                <stat.icon className="size-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-sm font-semibold text-slate-800">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-sm text-emerald-700">Estimated Total Project Cost</p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">
            {formatCurrency(totalLow)} – {formatCurrency(totalHigh)}
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            Materials + Labor (DIY saves {formatCurrency(project.labor_cost_min)} – {formatCurrency(project.labor_cost_max)})
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
