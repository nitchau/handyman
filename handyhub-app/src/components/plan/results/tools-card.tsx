"use client";

import { useState } from "react";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BomToolRequirement } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

type ToolAction = "own" | "rent" | "buy";

interface ToolsCardProps {
  tools: BomToolRequirement[];
}

export function ToolsCard({ tools }: ToolsCardProps) {
  const [actions, setActions] = useState<Record<string, ToolAction>>(() =>
    Object.fromEntries(tools.map((t) => [t.id, t.owned ? "own" : "rent"]))
  );

  const setAction = (id: string, action: ToolAction) => {
    setActions((prev) => ({ ...prev, [id]: action }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wrench className="size-5 text-slate-500" />
          <CardTitle>Tools Required</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tools.map((tool) => {
            const action = actions[tool.id];

            return (
              <div
                key={tool.id}
                className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="font-medium text-slate-800">{tool.name}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAction(tool.id, "own")}
                    className={cn(
                      "rounded-md border px-3 py-1 text-xs font-medium transition-colors",
                      action === "own"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    I own this
                  </button>
                  {tool.rental_price_per_day != null && (
                    <button
                      type="button"
                      onClick={() => setAction(tool.id, "rent")}
                      className={cn(
                        "rounded-md border px-3 py-1 text-xs font-medium transition-colors",
                        action === "rent"
                          ? "border-blue-300 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      Rent {formatPrice(tool.rental_price_per_day)}/day
                    </button>
                  )}
                  {tool.purchase_price != null && (
                    <button
                      type="button"
                      onClick={() => setAction(tool.id, "buy")}
                      className={cn(
                        "rounded-md border px-3 py-1 text-xs font-medium transition-colors",
                        action === "buy"
                          ? "border-amber-300 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      Buy {formatPrice(tool.purchase_price)}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
