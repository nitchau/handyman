"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { MapProvider, AddressAutocomplete, ContractorMap } from "@/components/maps";
import type { PlaceResult } from "@/components/maps";
import { useSearchStore } from "@/stores/search-store";
import { useUserLocation } from "@/hooks/useUserLocation";
import { CATEGORIES } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  ShieldCheck,
  Shield,
  ChevronDown,
  ChevronRight,
  MapPin,
  Search,
  List,
  Map as MapIcon,
  Crosshair,
  Loader2,
  Lightbulb,
  X,
  Clock,
  Briefcase,
} from "lucide-react";

// ── Main exported component ──────────────────────────────────────────

export function ContractorSearch() {
  return (
    <MapProvider>
      <SearchContent />
    </MapProvider>
  );
}

// ── Verification badge helper ─────────────────────────────────────────

function VerificationBadge({ tier }: { tier: string }) {
  switch (tier) {
    case "fully_verified":
      return (
        <span title="Fully Verified" className="inline-flex items-center gap-0.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600 fill-emerald-100" />
          <Star className="h-2.5 w-2.5 text-emerald-600 fill-emerald-600 -ml-1.5" />
        </span>
      );
    case "background_checked":
      return (
        <span title="Background Checked">
          <ShieldCheck className="h-4 w-4 text-emerald-600 fill-emerald-100" />
        </span>
      );
    case "id_verified":
      return (
        <span title="ID Verified">
          <Shield className="h-4 w-4 text-blue-500 fill-blue-100" />
        </span>
      );
    default:
      return null;
  }
}

// ── Category label helper ─────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {};
for (const cat of CATEGORIES) {
  CATEGORY_LABELS[cat.slug] = cat.name;
}

// ── Main search content ──────────────────────────────────────────────

function SearchContent() {
  const store = useSearchStore();
  const { getUserLocation, location: browserLoc, isLoading: geoLoading } =
    useUserLocation();
  const listRef = useRef<HTMLDivElement>(null);

  // ── Search handler ──────────────────────────────────────────────────

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
      if (store.minRating > 0)
        params.set("min_rating", store.minRating.toString());
      if (store.verifiedOnly) params.set("verified_only", "true");
      params.set("sort", store.sort);
      params.set("page", store.page.toString());

      const res = await fetch(`/api/contractors/search?${params.toString()}`);
      const json = await res.json();

      if (res.ok) {
        store.setResults(json.results, json.meta.total);
        if (json.meta.center) store.setCenter(json.meta.center);
        store.setMapMoved(false);
      }
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Re-search when filters change
  useEffect(() => {
    if (store.center) doSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    store.center,
    store.category,
    store.sort,
    store.minRating,
    store.radius,
    store.page,
    store.verifiedOnly,
  ]);

  // Apply browser geolocation when resolved
  useEffect(() => {
    if (browserLoc) {
      store.setCenter({ lat: browserLoc.lat, lng: browserLoc.lng });
      store.setAddress(browserLoc.address);
      store.setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserLoc]);

  const handlePlaceSelect = (place: PlaceResult) => {
    store.setCenter({ lat: place.lat, lng: place.lng });
    store.setAddress(place.address);
    store.setPage(1);
  };

  const handleSearch = () => {
    store.setPage(1);
    doSearch();
  };

  const handleSearchThisArea = () => {
    if (store.mapCenter) {
      store.setCenter(store.mapCenter);
      store.setPage(1);
      store.setMapMoved(false);
      doSearch();
    }
  };

  // Scroll to selected card
  useEffect(() => {
    if (!store.selectedContractorId || !listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-contractor-id="${store.selectedContractorId}"]`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [store.selectedContractorId]);

  // Build page title for SEO
  const categoryName = store.category
    ? CATEGORY_LABELS[store.category] || ""
    : "";
  const locationName = store.address
    ? store.address.split(",").slice(0, 2).join(",")
    : "";

  // Map pin data
  const mapPins = store.results
    .filter((c) => c.latitude && c.longitude)
    .map((c) => ({
      id: c.id,
      lat: c.latitude!,
      lng: c.longitude!,
      hourlyRate: c.hourly_rate,
      displayName: c.display_name,
    }));

  return (
    <>
      {/* Dynamic page title */}
      <title>
        {categoryName
          ? `${categoryName} Contractors`
          : "Find Contractors"}{" "}
        {locationName ? `Near ${locationName}` : ""} | HandyHub
      </title>

      <div className="min-h-screen bg-background">
        {/* ── Search bar ─────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <AddressAutocomplete
                  placeholder="City, zip code, or address..."
                  defaultValue={store.address}
                  onPlaceSelect={handlePlaceSelect}
                  className="flex-1"
                />
                {/* Use My Location button */}
                <button
                  onClick={getUserLocation}
                  disabled={geoLoading}
                  title="Use my location"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  {geoLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Crosshair className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="relative">
                <select
                  value={store.category}
                  onChange={(e) => store.setCategory(e.target.value)}
                  className="w-full sm:w-48 appearance-none rounded-xl bg-slate-50 border border-slate-200 py-3 pl-4 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {store.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Search
              </button>
            </div>

            {/* ── Filter row ──────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {/* Verified toggle */}
              <button
                onClick={() => store.setVerifiedOnly(!store.verifiedOnly)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                  store.verifiedOnly
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                <ShieldCheck className="h-3 w-3" />
                Verified Only
                {store.verifiedOnly && (
                  <X
                    className="h-3 w-3 ml-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      store.setVerifiedOnly(false);
                    }}
                  />
                )}
              </button>

              {/* Radius dropdown */}
              <div className="relative">
                <select
                  value={store.radius}
                  onChange={(e) => store.setRadius(Number(e.target.value))}
                  className="appearance-none rounded-full bg-white border border-slate-200 py-1.5 pl-3 pr-7 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-slate-300"
                >
                  <option value={5}>5 mi</option>
                  <option value={10}>10 mi</option>
                  <option value={25}>25 mi</option>
                  <option value={50}>50 mi</option>
                  <option value={100}>100 mi</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={store.sort}
                  onChange={(e) => store.setSort(e.target.value)}
                  className="appearance-none rounded-full bg-white border border-slate-200 py-1.5 pl-3 pr-7 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-slate-300"
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="reviews">Reviews</option>
                  <option value="price_low">Price (Low)</option>
                  <option value="price_high">Price (High)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
              </div>

              {/* Results count */}
              {store.center && !store.loading && (
                <span className="text-xs text-slate-500 ml-auto">
                  {store.total} contractor{store.total !== 1 ? "s" : ""} within{" "}
                  {store.radius} miles
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile view toggle ──────────────────────────────────────── */}
        <div className="lg:hidden bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-2 flex gap-1">
            <button
              onClick={() => store.setMobileView("list")}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
                store.mobileView === "list"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => store.setMobileView("map")}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
                store.mobileView === "map"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <MapIcon className="h-4 w-4" />
              Map
            </button>
          </div>
        </div>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            {/* Left: contractor cards */}
            <div
              ref={listRef}
              className={`flex-1 min-w-0 px-4 py-4 lg:pr-0 overflow-y-auto ${
                store.mobileView === "map" ? "hidden lg:block" : ""
              }`}
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              {/* Loading skeleton */}
              {store.loading && store.results.length === 0 && (
                <div className="grid gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ContractorCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Empty: no results */}
              {!store.loading &&
                store.results.length === 0 &&
                store.center && (
                  <div className="text-center py-16">
                    <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      No contractors found within {store.radius} miles
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                      Try expanding your search radius or changing the category.
                    </p>
                    <Link
                      href="/plan"
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Interested in DIY? Our AI can help you plan the project
                      yourself
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}

              {/* Empty: no search yet */}
              {!store.center && store.results.length === 0 && !store.loading && (
                <div className="text-center py-16">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Find contractors near you
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Enter your location above or{" "}
                    <button
                      onClick={getUserLocation}
                      className="text-emerald-600 hover:underline font-medium"
                    >
                      use your current location
                    </button>
                    .
                  </p>
                </div>
              )}

              {/* Results list */}
              {store.results.length > 0 && (
                <div className="grid gap-3">
                  {store.results.map((contractor) => (
                    <ContractorCard
                      key={contractor.id}
                      contractor={contractor}
                      selected={
                        store.selectedContractorId === contractor.id
                      }
                      onSelect={() =>
                        store.setSelectedContractorId(
                          store.selectedContractorId === contractor.id
                            ? null
                            : contractor.id
                        )
                      }
                      onHover={(hovering) =>
                        store.setSelectedContractorId(
                          hovering ? contractor.id : null
                        )
                      }
                    />
                  ))}

                  {/* Pagination */}
                  {store.total > 20 && (
                    <div className="flex justify-center gap-2 mt-4 pb-4">
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
                </div>
              )}
            </div>

            {/* Right: map — desktop always, mobile only in map view */}
            <div
              className={`lg:w-[40%] lg:sticky lg:top-[140px] lg:h-[calc(100vh-180px)] lg:p-4 ${
                store.mobileView === "map"
                  ? "w-full h-[calc(100vh-220px)]"
                  : "hidden lg:block"
              }`}
            >
              {store.loading && store.results.length === 0 ? (
                <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
              ) : (
                <ContractorMap
                  contractors={mapPins}
                  center={store.center ?? undefined}
                  selectedId={store.selectedContractorId}
                  userLocation={store.center}
                  onMarkerClick={(id) => {
                    store.setSelectedContractorId(
                      store.selectedContractorId === id ? null : id
                    );
                    // On mobile map view, switch to list to show the card
                    if (
                      store.mobileView === "map" &&
                      window.innerWidth < 1024
                    ) {
                      store.setMobileView("list");
                    }
                  }}
                  onCenterChanged={(center) => {
                    const prev = store.center;
                    if (!prev) return;
                    const dist = Math.abs(center.lat - prev.lat) + Math.abs(center.lng - prev.lng);
                    if (dist > 0.01) {
                      store.setMapMoved(true);
                      store.setMapCenter(center);
                    }
                  }}
                  onSearchThisArea={handleSearchThisArea}
                  showSearchAreaButton={store.mapMoved}
                />
              )}

              {/* Mobile bottom sheet for selected contractor */}
              {store.mobileView === "map" && store.selectedContractorId && (
                <MobileSelectedCard
                  contractor={store.results.find(
                    (c) => c.id === store.selectedContractorId
                  )}
                  onClose={() => store.setSelectedContractorId(null)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Mobile bottom sheet for selected contractor ─────────────────────

function MobileSelectedCard({
  contractor,
  onClose,
}: {
  contractor:
    | {
        id: string;
        display_name: string;
        avatar_url: string | null;
        business_name: string;
        hourly_rate: number | null;
        rating_avg: number;
        review_count: number;
        distance_miles: number;
        verification_tier: string;
        categories: string[];
      }
    | undefined;
  onClose: () => void;
}) {
  if (!contractor) return null;

  return (
    <div className="lg:hidden absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 p-4 animate-in slide-in-from-bottom duration-200">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100"
      >
        <X className="h-4 w-4 text-slate-400" />
      </button>
      <div className="flex gap-3">
        <div className="shrink-0 w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
          {contractor.avatar_url ? (
            <img
              src={contractor.avatar_url}
              alt={contractor.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-base font-bold text-slate-500">
              {contractor.display_name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
            {contractor.display_name}
            <VerificationBadge tier={contractor.verification_tier} />
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span className="inline-flex items-center gap-0.5">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              {Number(contractor.rating_avg).toFixed(1)} (
              {contractor.review_count})
            </span>
            <span>{contractor.distance_miles.toFixed(1)} mi</span>
            {contractor.hourly_rate && <span>${contractor.hourly_rate}/hr</span>}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {contractor.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
              >
                {CATEGORY_LABELS[cat] || cat.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Link
        href={`/contractors/${contractor.id}`}
        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
      >
        View Profile
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// ── Skeleton loading card ────────────────────────────────────────────

function ContractorCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex gap-4">
        <Skeleton className="shrink-0 w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2.5">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-1.5 pt-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
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
  onHover: (hovering: boolean) => void;
}

function ContractorCard({
  contractor,
  selected,
  onHover,
}: ContractorCardProps) {
  return (
    <Link
      href={`/contractors/${contractor.id}`}
      data-contractor-id={contractor.id}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`block bg-white rounded-xl border p-4 cursor-pointer transition-all ${
        selected
          ? "border-emerald-500 ring-2 ring-emerald-100 shadow-sm"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="relative shrink-0 w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
          {contractor.avatar_url ? (
            <img
              src={contractor.avatar_url}
              alt={contractor.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-base font-bold text-slate-500">
              {contractor.display_name.charAt(0)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-1.5 text-sm">
                {contractor.display_name}
                <VerificationBadge tier={contractor.verification_tier} />
              </h3>
              {contractor.business_name && (
                <p className="text-xs text-slate-500 truncate">
                  {contractor.business_name}
                </p>
              )}
            </div>
            {contractor.hourly_rate != null && (
              <span className="text-base font-bold text-emerald-700 whitespace-nowrap">
                ${contractor.hourly_rate}
                <span className="text-[10px] font-normal text-slate-500">
                  /hr
                </span>
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-2.5 mt-1.5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-slate-700">
                {Number(contractor.rating_avg).toFixed(1)}
              </span>
              <span>({contractor.review_count} reviews)</span>
            </span>
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {contractor.distance_miles.toFixed(1)} mi
            </span>
            <span className="inline-flex items-center gap-0.5">
              <Briefcase className="h-3 w-3" />
              {contractor.years_experience}yr
            </span>
          </div>

          {/* Bio */}
          {contractor.bio && (
            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
              {contractor.bio}
            </p>
          )}

          {/* Category pills */}
          {contractor.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {contractor.categories.slice(0, 4).map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-medium"
                >
                  {CATEGORY_LABELS[cat] || cat.replace(/-/g, " ")}
                </span>
              ))}
              {contractor.categories.length > 4 && (
                <span className="text-[10px] text-slate-400">
                  +{contractor.categories.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
              <Clock className="h-3 w-3" />
              Responds in ~2 hours
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              View Profile
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
