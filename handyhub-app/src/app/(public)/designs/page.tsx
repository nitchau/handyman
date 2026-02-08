"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryCard, FilterChipBar } from "@/components/gallery";
import {
  designIdeas,
  roomTypeOptions,
  styleOptions,
  budgetOptions,
  sortOptions,
} from "@/data/gallery-data";
import { Loader2 } from "lucide-react";

export default function DesignsPage() {
  const [roomFilter, setRoomFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [budget, setBudget] = useState("all");
  const [sort, setSort] = useState("trending");
  const [diyOnly, setDiyOnly] = useState(false);

  const filtered = designIdeas.filter((d) => {
    if (roomFilter !== "all" && d.room_type !== roomFilter) return false;
    if (styleFilter !== "all" && d.style !== styleFilter) return false;
    if (diyOnly && !d.is_diy_friendly) return false;
    const cost = d.estimated_cost ?? 0;
    if (budget === "under1k" && cost >= 1000) return false;
    if (budget === "1k-5k" && (cost < 1000 || cost >= 5000)) return false;
    if (budget === "5k-15k" && (cost < 5000 || cost >= 15000)) return false;
    if (budget === "15k+" && cost < 15000) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Design Ideas</h1>
            <p className="mt-1 text-sm text-slate-500">
              Stunning room designs by professional and community designers
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex">
            Upload Your Design
          </Button>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-30 border-b bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-8">
        <div className="mx-auto max-w-7xl space-y-2">
          <FilterChipBar
            options={roomTypeOptions}
            selected={roomFilter}
            onChange={setRoomFilter}
          />
          <FilterChipBar
            options={styleOptions}
            selected={styleFilter}
            onChange={setStyleFilter}
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600"
            >
              {budgetOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={diyOnly}
                  onChange={(e) => setDiyOnly(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:size-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
              </div>
              DIY Friendly
            </label>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {filtered.map((design) => (
            <div key={design.id} className="mb-4 break-inside-avoid">
              <GalleryCard design={design} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            No designs match your filters. Try adjusting your criteria.
          </div>
        )}

        {/* Infinite scroll indicator */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
            <Loader2 className="size-4 animate-spin" />
            Loading more designs...
          </div>
        )}
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105">
        <Plus className="size-6" />
      </button>
    </div>
  );
}
