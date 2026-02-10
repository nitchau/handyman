"use client";

import { useCallback, useEffect } from "react";
import { Navbar } from "@/components/landing/navbar";
import { MapProvider, AddressAutocomplete, ContractorMap } from "@/components/maps";
import type { PlaceResult } from "@/components/maps";
import { useSearchStore } from "@/stores/search-store";
import { CATEGORIES } from "@/lib/constants";
import { Star, Shield, ChevronDown, Loader2, MapPin, Search } from "lucide-react";

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <MapProvider>
        <SearchContent />
      </MapProvider>
    </>
  );
}

function SearchContent() {
  const store = useSearchStore();

  const doSearch = useCallback(async () => {
    if (!store.center && !store.address) return;

    store.setLoading(true);
    try {
      const params = new URLSearchParams();
      if (store.center) {
        params.set("lat", store.center.lat.toString());
        params.set("lng", store.center.lng.toString());
      } else if (store.address) {
        params.set("address", store.address);
      }
      params.set("radius", store.radius.toString());
      if (store.category) params.set("category", store.category);
      if (store.minRating > 0) params.set("min_rating", store.minRating.toString());
      params.set("sort", store.sort);
      params.set("page", store.page.toString());

      const res = await fetch(`/api/contractors/search?${params.toString()}`);
      const json = await res.json();

      if (res.ok) {
        store.setResults(json.results, json.meta.total);
        if (json.meta.center) store.setCenter(json.meta.center);
      }
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Re-search when filters change (after initial search)
  useEffect(() => {
    if (store.center) doSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.category, store.sort, store.minRating, store.radius, store.page]);

  const handlePlaceSelect = (place: PlaceResult) => {
    store.setCenter({ lat: place.lat, lng: place.lng });
    store.setAddress(place.address);
    store.setPage(1);
  };

  const handleSearch = () => {
    store.setPage(1);
    doSearch();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <AddressAutocomplete
              placeholder="City, zip code, or address..."
              defaultValue={store.address}
              onPlaceSelect={handlePlaceSelect}
              className="flex-1"
            />
            <div className="relative">
              <select
                value={store.category}
                onChange={(e) => store.setCategory(e.target.value)}
                className="w-full sm:w-48 appearance-none rounded-xl bg-slate-50 border border-slate-200 py-3 pl-4 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            <button
              onClick={handleSearch}
              disabled={store.loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {store.loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { label: "4+ Stars", value: 4, active: store.minRating >= 4 },
              { label: "3+ Stars", value: 3, active: store.minRating >= 3 && store.minRating < 4 },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() =>
                  store.setMinRating(chip.active ? 0 : chip.value)
                }
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  chip.active
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                }`}
              >
                <Star className="h-3 w-3" />
                {chip.label}
              </button>
            ))}

            {/* Sort dropdown */}
            <div className="relative ml-auto">
              <select
                value={store.sort}
                onChange={(e) => store.setSort(e.target.value)}
                className="appearance-none rounded-full bg-slate-100 border border-slate-200 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="distance">Nearest</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content: list + map */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left: contractor cards */}
          <div className="flex-1 min-w-0">
            {store.loading && store.results.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}

            {!store.loading && store.results.length === 0 && store.center && (
              <div className="text-center py-20">
                <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">No contractors found</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Try expanding your search radius or changing filters.
                </p>
              </div>
            )}

            {!store.center && store.results.length === 0 && (
              <div className="text-center py-20">
                <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Find contractors near you
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Enter your location above to discover local professionals.
                </p>
              </div>
            )}

            {store.results.length > 0 && (
              <>
                <p className="text-sm text-slate-500 mb-4">
                  {store.total} contractor{store.total !== 1 ? "s" : ""} found
                </p>
                <div className="grid gap-4">
                  {store.results.map((contractor) => (
                    <ContractorCard
                      key={contractor.id}
                      contractor={contractor}
                      selected={store.selectedContractorId === contractor.id}
                      onSelect={() =>
                        store.setSelectedContractorId(
                          store.selectedContractorId === contractor.id
                            ? null
                            : contractor.id
                        )
                      }
                    />
                  ))}
                </div>

                {/* Pagination */}
                {store.total > 20 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      disabled={store.page <= 1}
                      onClick={() => store.setPage(store.page - 1)}
                      className="px-4 py-2 text-sm rounded-lg bg-white border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
                    >
                      Previous
                    </button>
                    <span className="flex items-center px-4 py-2 text-sm text-slate-600">
                      Page {store.page} of {Math.ceil(store.total / 20)}
                    </span>
                    <button
                      disabled={store.page >= Math.ceil(store.total / 20)}
                      onClick={() => store.setPage(store.page + 1)}
                      className="px-4 py-2 text-sm rounded-lg bg-white border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: map (hidden on mobile) */}
          <div className="hidden lg:block w-[40%] sticky top-[140px] h-[calc(100vh-180px)]">
            <ContractorMap
              contractors={store.results
                .filter((c) => c.latitude && c.longitude)
                .map((c) => ({
                  id: c.id,
                  lat: c.latitude!,
                  lng: c.longitude!,
                  hourlyRate: c.hourly_rate,
                  displayName: c.display_name,
                }))}
              center={store.center ?? undefined}
              selectedId={store.selectedContractorId}
              onMarkerClick={(id) =>
                store.setSelectedContractorId(
                  store.selectedContractorId === id ? null : id
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Contractor Card ──────────────────────────────────────────────────

interface ContractorCardProps {
  contractor: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    business_name: string;
    bio: string | null;
    hourly_rate: number | null;
    rating_avg: number;
    review_count: number;
    distance_miles: number;
    verification_tier: string;
    years_experience: number;
    categories: string[];
  };
  selected: boolean;
  onSelect: () => void;
}

function ContractorCard({ contractor, selected, onSelect }: ContractorCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
        selected
          ? "border-blue-500 ring-2 ring-blue-100"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0 w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
          {contractor.avatar_url ? (
            <img
              src={contractor.avatar_url}
              alt={contractor.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-slate-500">
              {contractor.display_name.charAt(0)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-1.5">
                {contractor.display_name}
                {contractor.verification_tier !== "new" && (
                  <Shield className="h-4 w-4 text-blue-600" />
                )}
              </h3>
              {contractor.business_name && (
                <p className="text-xs text-slate-500">{contractor.business_name}</p>
              )}
            </div>
            {contractor.hourly_rate && (
              <span className="text-lg font-bold text-slate-900 whitespace-nowrap">
                ${contractor.hourly_rate}
                <span className="text-xs font-normal text-slate-500">/hr</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              {Number(contractor.rating_avg).toFixed(1)} ({contractor.review_count})
            </span>
            <span>{contractor.distance_miles.toFixed(1)} mi</span>
            <span>{contractor.years_experience}yr exp</span>
          </div>

          {contractor.bio && (
            <p className="text-sm text-slate-600 mt-2 line-clamp-2">{contractor.bio}</p>
          )}

          {contractor.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {contractor.categories.slice(0, 4).map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600"
                >
                  {cat.replace(/-/g, " ")}
                </span>
              ))}
              {contractor.categories.length > 4 && (
                <span className="text-xs text-slate-400">
                  +{contractor.categories.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
