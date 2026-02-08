"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, MessageSquare, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DesignerBadge, FilterChipBar, GalleryCard } from "@/components/gallery";
import { designers, designIdeas, designerServices, designerReviews } from "@/data/gallery-data";
import { cn } from "@/lib/utils";

interface DesignerProfilePageProps {
  readonly params: Promise<{ id: string }>;
}

function formatLabel(val: string): string {
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DesignerProfilePage({ params }: DesignerProfilePageProps) {
  const { id } = use(params);
  const designer = designers.find((d) => d.id === id) ?? designers[0];
  const designs = designIdeas.filter((d) => d.designer_id === designer.id);
  const services = designerServices.filter((s) => s.designer_id === designer.id);
  const reviews = designerReviews;

  const [activeTab, setActiveTab] = useState<"portfolio" | "services" | "reviews">("portfolio");
  const [portfolioFilter, setPortfolioFilter] = useState("all");

  const filteredDesigns = designs.filter(
    (d) => portfolioFilter === "all" || d.room_type === portfolioFilter
  );

  const roomFilterOptions = [
    { value: "all", label: "All" },
    ...designer.room_types.map((rt) => ({ value: rt, label: formatLabel(rt) })),
  ];

  const ratingBreakdown = [
    { stars: 5, count: 42 },
    { stars: 4, count: 4 },
    { stars: 3, count: 1 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  const stats = [
    { value: designer.total_ideas_posted.toString(), label: "Designs" },
    { value: designer.total_likes >= 1000 ? `${(designer.total_likes / 1000).toFixed(1)}K` : designer.total_likes.toString(), label: "Likes" },
    { value: `\u2605 ${designer.rating_avg}`, label: `${designer.review_count} reviews` },
    { value: `${designer.years_experience} ${designer.years_experience === 1 ? "yr" : "yrs"}`, label: "Experience" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Cover photo */}
      <div className="relative h-[180px] sm:h-[280px] w-full overflow-hidden bg-slate-300">
        <Image
          src={designer.cover_photo_url ?? ""}
          alt={`${designer.display_name} cover`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Action buttons on cover */}
        <div className="absolute bottom-4 right-4 hidden gap-2 sm:flex">
          <Button className="shadow-lg">Hire {designer.display_name.split(" ")[0]} &rarr;</Button>
          <Button variant="outline" className="border-white bg-white/90 shadow-lg">
            <MessageSquare className="mr-1.5 size-4" /> Message
          </Button>
        </div>
      </div>

      {/* Profile info */}
      <div className="relative bg-white px-4 pb-6 sm:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Avatar */}
          <div className="-mt-10 mb-4 flex justify-center sm:-mt-12 sm:justify-start">
            <Image
              src={designer.avatar_url ?? ""}
              alt={designer.display_name}
              width={96}
              height={96}
              className="size-[72px] rounded-full border-[3px] border-white object-cover shadow-md sm:size-24 sm:border-4"
            />
          </div>

          {/* Name + badge */}
          <div className="text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold text-slate-800">{designer.display_name}</h1>
              <DesignerBadge tier={designer.designer_tier} size="md" />
            </div>
            <p className="mt-1 text-sm text-slate-500">
              <MapPin className="mr-0.5 inline size-3.5" /> {[designer.location_city, designer.location_state].filter(Boolean).join(", ")}
              {designer.accepts_remote_clients && <span className="ml-1 text-primary"> &middot; Accepts remote clients \u2713</span>}
            </p>
          </div>

          {/* Mobile action buttons */}
          <div className="mt-4 flex gap-2 sm:hidden">
            <Button className="flex-1">Hire {designer.display_name.split(" ")[0]} &rarr;</Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="mr-1.5 size-4" /> Message
            </Button>
          </div>

          {/* Bio */}
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:max-w-xl">{designer.bio}</p>

          {/* Social */}
          {(designer.instagram_handle || designer.tiktok_handle || designer.pinterest_handle) && (
            <div className="mt-3 flex gap-3">
              {designer.instagram_handle && (
                <a href={`https://instagram.com/${designer.instagram_handle}`} className="text-slate-400 hover:text-slate-600">
                  <Instagram className="size-4" />
                </a>
              )}
              {designer.tiktok_handle && (
                <a href={`https://tiktok.com/@${designer.tiktok_handle}`} className="text-slate-400 hover:text-slate-600">
                  <Instagram className="size-4" />
                </a>
              )}
              {designer.pinterest_handle && (
                <a href={`https://pinterest.com/${designer.pinterest_handle}`} className="text-slate-400 hover:text-slate-600">
                  <Instagram className="size-4" />
                </a>
              )}
            </div>
          )}

          {/* Specialty pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {designer.specialties.map((s) => (
              <span key={s} className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                {formatLabel(s)}
              </span>
            ))}
            {designer.room_types.map((rt) => (
              <span key={rt} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {formatLabel(rt)}
              </span>
            ))}
          </div>

          {designer.credentials.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">\uD83C\uDF93 {designer.credentials.join(" \u00b7 ")}</p>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-y bg-slate-50 px-4 py-4">
        <div className="mx-auto flex max-w-5xl justify-around">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-bold text-slate-800 sm:text-xl">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-5xl">
          {(["portfolio", "services", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3 text-center text-sm font-medium transition-colors",
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Portfolio tab */}
            {activeTab === "portfolio" && (
              <div className="space-y-4">
                <FilterChipBar
                  options={roomFilterOptions}
                  selected={portfolioFilter}
                  onChange={setPortfolioFilter}
                />
                <div className="columns-2 gap-3 sm:columns-3">
                  {filteredDesigns.map((d) => (
                    <div key={d.id} className="mb-3 break-inside-avoid">
                      <GalleryCard design={d} />
                    </div>
                  ))}
                </div>
                {designs.length > filteredDesigns.length && (
                  <p className="text-center text-sm font-medium text-primary">
                    View All ({designer.total_ideas_posted}) &rarr;
                  </p>
                )}
              </div>
            )}

            {/* Services tab */}
            {activeTab === "services" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="space-y-2 p-5">
                      <h3 className="font-semibold text-slate-800">{service.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-3">{service.description}</p>
                      <div className="text-xs text-slate-400">
                        \uD83D\uDCE6 {service.delivery_days}
                        {service.revisions > 0 && <span> &middot; \uD83D\uDD04 {service.revisions} revision{service.revisions > 1 ? "s" : ""}</span>}
                      </div>
                      <p className="text-xl font-bold text-primary">${service.price}</p>
                      <Link href={`/book/${service.id}`}>
                        <Button className="w-full">Book This Service &rarr;</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Reviews tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Overall rating */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-slate-800">{designer.rating_avg}</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={cn("size-4", s <= Math.round(designer.rating_avg) ? "fill-primary text-primary" : "text-slate-200")} />
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{designer.review_count} reviews</p>
                      </div>
                      <div className="flex-1 space-y-1">
                        {ratingBreakdown.map((row) => (
                          <div key={row.stars} className="flex items-center gap-2 text-xs">
                            <span className="w-4 text-right text-slate-500">{row.stars}\u2605</span>
                            <div className="h-2 flex-1 rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${(row.count / designer.review_count) * 100}%` }}
                              />
                            </div>
                            <span className="w-5 text-slate-400">{row.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual reviews */}
                {reviews.map((review) => (
                  <div key={review.id} className="space-y-2 border-b pb-4 last:border-0">
                    <div className="flex items-center gap-2">
                      <Image
                        src={review.client_avatar}
                        alt={review.client_name}
                        width={32}
                        height={32}
                        className="size-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-slate-800">{review.client_name}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={cn("size-3", s <= review.rating ? "fill-primary text-primary" : "text-slate-200")} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{review.created_at}</span>
                    </div>
                    <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                      {review.service_title}
                    </span>
                    <p className="text-sm leading-relaxed text-slate-600">{review.text}</p>
                    {review.designer_reply && (
                      <div className="ml-10 rounded-lg bg-slate-50 p-3">
                        <div className="mb-1 flex items-center gap-1.5">
                          <Image
                            src={designer.avatar_url ?? ""}
                            alt={designer.display_name}
                            width={20}
                            height={20}
                            className="size-5 rounded-full object-cover"
                          />
                          <span className="text-xs font-medium text-slate-700">{designer.display_name}</span>
                        </div>
                        <p className="text-sm text-slate-600">{review.designer_reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky sidebar CTA */}
          <div className="hidden lg:block">
            <Card className="sticky top-16 border-t-[3px] border-t-primary shadow-md">
              <CardContent className="space-y-3 p-5">
                <h3 className="font-semibold text-slate-800">Work with {designer.display_name.split(" ")[0]}</h3>
                <div>
                  <span className="text-xs text-slate-400">Starting from</span>
                  <p className="text-2xl font-bold text-primary">${Math.min(...services.map((s) => s.price))}</p>
                </div>
                <Button className="w-full" onClick={() => setActiveTab("services")}>View Services &rarr;</Button>
                <hr />
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="size-3.5" /> Response time: ~{designer.response_time_hours} hours
                </p>
                <button className="text-sm font-medium text-primary hover:underline">
                  <MessageSquare className="mr-1 inline size-3.5" /> Send Message
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
