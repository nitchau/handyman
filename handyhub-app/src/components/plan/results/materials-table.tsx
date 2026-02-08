"use client";

import { useState } from "react";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Retailer, type BomItem } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RETAILER_LABELS: Record<Retailer, string> = {
  [Retailer.HOME_DEPOT]: "Home Depot",
  [Retailer.LOWES]: "Lowe's",
  [Retailer.AMAZON]: "Amazon",
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function confidenceColor(score: number) {
  if (score >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 70) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

type SortKey = "name" | "confidence" | "price";

interface MaterialsTableProps {
  items: BomItem[];
}

export function MaterialsTable({ items }: MaterialsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = [...items].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
    if (sortKey === "confidence") return (a.confidence - b.confidence) * dir;
    const aMin = Math.min(...a.prices.map((p) => p.price));
    const bMin = Math.min(...b.prices.map((p) => p.price));
    return (aMin - bMin) * dir;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Materials & Supplies</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleSort("name")}
                    className="gap-1 font-medium text-slate-600"
                  >
                    Item <ArrowUpDown className="size-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-slate-600">Qty</th>
                <th className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleSort("confidence")}
                    className="gap-1 font-medium text-slate-600"
                  >
                    Confidence <ArrowUpDown className="size-3" />
                  </Button>
                </th>
                <th className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleSort("price")}
                    className="gap-1 font-medium text-slate-600"
                  >
                    Price Comparison <ArrowUpDown className="size-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      {item.notes && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn(confidenceColor(item.confidence))}
                    >
                      {item.confidence}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {item.prices.map((price) => (
                        <a
                          key={price.retailer}
                          href={price.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors hover:bg-slate-50",
                            price.in_stock
                              ? "border-slate-200 text-slate-700"
                              : "border-slate-100 text-slate-400 line-through"
                          )}
                        >
                          <span className="font-medium">
                            {RETAILER_LABELS[price.retailer]}
                          </span>
                          <span>{formatPrice(price.price)}</span>
                          <ExternalLink className="size-3" />
                        </a>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
