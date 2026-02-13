"use client";

import { useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronRight, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Retailer, type BomItem, type BomTask } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/lib/i18n/language-context";

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
  tasks?: BomTask[];
}

function ItemRow({ item }: { item: BomItem }) {
  const { t } = useTranslation();
  const hasWaste = item.waste_factor > 0 && item.quantity_with_waste > 0;

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-slate-800">{item.name}</p>
            {item.price_source === "catalog" ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                      <ShieldCheck className="size-2.5" />
                      {t("plan.results.catalogVerified")}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Price verified against retailer catalog</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : item.price_source === "ai_estimate" ? (
              <span className="inline-flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                <Sparkles className="size-2.5" />
                {t("plan.results.aiEstimate")}
              </span>
            ) : null}
          </div>
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
      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
        {hasWaste ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="border-b border-dashed border-slate-300">
                  {Math.ceil(item.quantity_with_waste)} {item.unit}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("plan.results.wasteFactor").replace("{pct}", String(Math.round(item.waste_factor * 100)))}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-slate-400">—</span>
        )}
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
              href={price.url || undefined}
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
              {price.url && <ExternalLink className="size-3" />}
            </a>
          ))}
        </div>
      </td>
    </tr>
  );
}

function TableHeader({
  sortKey,
  sortAsc,
  onSort,
}: {
  sortKey: SortKey;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
}) {
  const { t } = useTranslation();
  return (
    <thead>
      <tr className="border-b border-slate-200 bg-slate-50 text-left">
        <th className="px-4 py-3">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onSort("name")}
            className="gap-1 font-medium text-slate-600"
          >
            Item <ArrowUpDown className="size-3" />
          </Button>
        </th>
        <th className="px-4 py-3 text-slate-600">Qty</th>
        <th className="px-4 py-3 text-slate-600">{t("plan.results.adjustedQty")}</th>
        <th className="px-4 py-3">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onSort("confidence")}
            className="gap-1 font-medium text-slate-600"
          >
            Confidence <ArrowUpDown className="size-3" />
          </Button>
        </th>
        <th className="px-4 py-3">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onSort("price")}
            className="gap-1 font-medium text-slate-600"
          >
            Price Comparison <ArrowUpDown className="size-3" />
          </Button>
        </th>
      </tr>
    </thead>
  );
}

function sortItems(items: BomItem[], sortKey: SortKey, sortAsc: boolean) {
  return [...items].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
    if (sortKey === "confidence") return (a.confidence - b.confidence) * dir;
    const aQty = a.quantity_with_waste || a.quantity;
    const bQty = b.quantity_with_waste || b.quantity;
    const aMin = Math.min(...a.prices.map((p) => p.price)) * aQty;
    const bMin = Math.min(...b.prices.map((p) => p.price)) * bQty;
    return (aMin - bMin) * dir;
  });
}

function TaskSection({
  task,
  items,
  sortKey,
  sortAsc,
  onSort,
}: {
  task: BomTask;
  items: BomItem[];
  sortKey: SortKey;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const sorted = sortItems(items, sortKey, sortAsc);

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center gap-2 bg-slate-100 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-150 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="size-4 text-slate-400" />
        ) : (
          <ChevronDown className="size-4 text-slate-400" />
        )}
        {task.name}
        <span className="text-xs font-normal text-slate-400">
          ({items.length} items)
        </span>
      </button>
      {!collapsed && (
        <table className="w-full text-sm">
          <TableHeader sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
          <tbody>
            {sorted.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function MaterialsTable({ items, tasks }: MaterialsTableProps) {
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

  const hasTasks = tasks && tasks.length > 0;

  // Build a lookup of itemId -> item for task grouping
  const itemMap = new Map(items.map((item) => [item.id, item]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Materials & Supplies</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {hasTasks ? (
            // Task-grouped view
            <div>
              {[...tasks]
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((task) => {
                  const taskItems = task.itemIds
                    .map((id) => itemMap.get(id))
                    .filter((item): item is BomItem => item !== undefined);
                  if (taskItems.length === 0) return null;
                  return (
                    <TaskSection
                      key={task.id}
                      task={task}
                      items={taskItems}
                      sortKey={sortKey}
                      sortAsc={sortAsc}
                      onSort={handleSort}
                    />
                  );
                })}
            </div>
          ) : (
            // Flat table (backward compatibility)
            <table className="w-full text-sm">
              <TableHeader sortKey={sortKey} sortAsc={sortAsc} onSort={handleSort} />
              <tbody>
                {sortItems(items, sortKey, sortAsc).map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
