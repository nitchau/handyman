"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, Heart, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { contractors } from "@/data/contractor-data";

const SERVICE_OPTIONS = ["All Services", "Plumbing", "Electrical", "Painting", "Carpentry", "General Handyman", "HVAC", "Roofing"];

const FILTER_CHIPS = [
  { id: "rating", label: "Rating 4+", active: true },
  { id: "price", label: "Price $$-$$$", active: false },
  { id: "availability", label: "Availability: Today", active: false },
  { id: "verified", label: "Verified Pro Only", active: false },
];

const SORT_OPTIONS = ["Recommended", "Highest Rated", "Most Reviews", "Lowest Price"];

export default function ContractorSearchPage() {
  const [locationQuery, setLocationQuery] = useState("San Francisco, CA");
  const [serviceCategory, setServiceCategory] = useState("All Services");
  const [sortBy, setSortBy] = useState("Recommended");
  const [filters, setFilters] = useState(FILTER_CHIPS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFilter = (id: string) => {
    setFilters(filters.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search bar */}
      <div className="border-b bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2">
            <MapPin className="size-4 text-slate-400" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Location..."
            />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2">
            <SlidersHorizontal className="size-4 text-slate-400" />
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="flex-1 cursor-pointer bg-transparent text-sm font-medium text-slate-900 outline-none"
            >
              {SERVICE_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <Button className="gap-2 shadow-sm">
            <Search className="size-4" /> Search
          </Button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="border-b bg-white px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => toggleFilter(f.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                f.active
                  ? "border-primary/20 bg-primary/10 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              )}
            >
              {f.label}
              {f.active && <X className="size-3.5" />}
            </button>
          ))}
          <div className="mx-1 h-6 w-px bg-slate-200" />
          <button className="text-sm font-medium text-slate-500 hover:text-slate-800">Reset all</button>
        </div>
      </div>

      {/* Main content: list + map */}
      <div className="flex" style={{ height: "calc(100vh - 12rem)" }}>
        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-6 lg:w-2/3">
          <div className="mx-auto max-w-5xl">
            {/* Results header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-xl font-bold text-slate-900">
                {contractors.length} contractors near {locationQuery}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cursor-pointer rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contractor grid */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {contractors.map((c) => (
                <Card key={c.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <Image
                          src={c.avatar_url}
                          alt={c.name}
                          width={64}
                          height={64}
                          className="size-16 rounded-full border-2 border-slate-50 object-cover"
                        />
                        {c.verified && (
                          <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                            \u2713
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="truncate text-lg font-bold text-slate-900">{c.name}</h3>
                            <div className="mt-0.5 flex items-center gap-1 text-sm">
                              <Star className="size-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-slate-900">{c.rating_avg}</span>
                              <span className="text-slate-500">({c.review_count} reviews)</span>
                            </div>
                          </div>
                          <button onClick={() => toggleFavorite(c.id)} className="text-slate-400 transition-colors hover:text-primary">
                            <Heart className={cn("size-5", favorites.has(c.id) && "fill-primary text-primary")} />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                          <MapPin className="size-3.5" />
                          {c.location} ({c.distance_miles} mi)
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4 mt-4 flex flex-wrap gap-2">
                      {c.specialties.map((s) => (
                        <span key={s} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <p className="text-xs text-slate-500">Starting from</p>
                        <p className="text-lg font-bold text-primary">
                          ${c.hourly_rate}
                          <span className="text-sm font-normal text-slate-500">/hr</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/contractors/${c.id}`}>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                        <Button size="sm">Request Quote</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load more */}
            <div className="mb-12 mt-8 flex justify-center">
              <Button variant="outline" size="lg">
                Load More Pros
              </Button>
            </div>
          </div>
        </div>

        {/* Map sidebar */}
        <div className="hidden border-l lg:block lg:w-1/3">
          <div className="relative flex h-full items-center justify-center bg-slate-100">
            <div className="rounded-lg bg-white px-4 py-2 shadow-xl">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <span className="text-sm font-bold">Map view coming soon</span>
              </div>
            </div>
            {/* Map markers placeholder */}
            {contractors.slice(0, 4).map((c, i) => (
              <div
                key={c.id}
                className="absolute flex size-10 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${20 + (i % 3) * 25}%`,
                }}
              >
                <span className="text-xs font-bold">${c.hourly_rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
