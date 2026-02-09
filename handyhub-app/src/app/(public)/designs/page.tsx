"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryCard, FilterChipBar } from "@/components/gallery";
import {
  roomTypeOptions,
  styleOptions,
  budgetOptions,
  sortOptions,
} from "@/data/gallery-data";
import type { DesignIdea } from "@/types/database";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";

const PAGE_SIZE = 12;

export default function DesignsPage() {
  const { t } = useTranslation();
  const [roomFilter, setRoomFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [budget, setBudget] = useState("all");
  const [sort, setSort] = useState("trending");
  const [diyOnly, setDiyOnly] = useState(false);

  const [designs, setDesigns] = useState<DesignIdea[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchDesigns = useCallback(async (pageNum: number, reset: boolean) => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: String(pageNum),
      limit: String(PAGE_SIZE),
      sort,
    });
    if (roomFilter !== "all") params.set("room", roomFilter);
    if (styleFilter !== "all") params.set("style", styleFilter);
    if (budget !== "all") params.set("budget", budget);
    if (diyOnly) params.set("diy", "true");

    try {
      const res = await fetch(`/api/designs?${params}`);
      const json = await res.json();
      const newData: DesignIdea[] = json.data ?? [];
      const meta = json.meta ?? {};

      if (reset) {
        setDesigns(newData);
      } else {
        setDesigns((prev) => [...prev, ...newData]);
      }

      setHasMore(pageNum < (meta.totalPages ?? 1));
    } catch {
      // On error, stop loading more
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setInitialLoad(false);
    }
  }, [roomFilter, styleFilter, budget, sort, diyOnly]);

  // Reset and fetch page 1 when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchDesigns(1, true);
  }, [fetchDesigns]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => {
            const next = prev + 1;
            fetchDesigns(next, false);
            return next;
          });
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, fetchDesigns]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">{t("designs.title")}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {t("designs.subtitle")}
            </p>
          </div>
          <Link href="/dashboard/upload">
            <Button variant="outline" className="hidden sm:flex">
              {t("designs.uploadBtn")}
            </Button>
          </Link>
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
              {t("designs.diyFriendly")}
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
          {designs.map((design) => (
            <div key={design.id} className="mb-4 break-inside-avoid">
              <GalleryCard design={design} />
            </div>
          ))}
        </div>

        {designs.length === 0 && !isLoading && !initialLoad && (
          <div className="py-20 text-center text-slate-400">
            {t("designs.noResults")}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" />

        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
            <Loader2 className="size-4 animate-spin" />
            {t("designs.loading")}
          </div>
        )}

        {!hasMore && designs.length > 0 && !isLoading && (
          <div className="py-8 text-center text-sm text-slate-400">
            {t("designs.endOfResults")}
          </div>
        )}
      </div>

      {/* FAB */}
      <Link
        href="/dashboard/upload"
        className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
      >
        <Plus className="size-6" />
      </Link>
    </div>
  );
}
