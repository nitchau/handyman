"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bookmark, Share2, ChevronLeft, ChevronRight, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesignerBadge, GalleryCard, ProductTagDot } from "@/components/gallery";
import { designIdeas, designerServices } from "@/data/gallery-data";
import { Difficulty, type DesignIdea } from "@/types/database";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface DesignDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

const difficultyStyles: Record<Difficulty, string> = {
  [Difficulty.BEGINNER]: "bg-green-100 text-green-700",
  [Difficulty.INTERMEDIATE]: "bg-amber-100 text-amber-700",
  [Difficulty.ADVANCED]: "bg-red-100 text-red-700",
};

function formatLabel(val: string): string {
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DesignDetailPage({ params }: DesignDetailPageProps) {
  const { id } = use(params);
  const design = designIdeas.find((d) => d.id === id) ?? designIdeas[0];
  const relatedDesigns = designIdeas.filter((d) => d.id !== design.id && d.room_type === design.room_type).slice(0, 6);
  const services = designerServices.filter((s) => s.designer_id === design.designer?.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Photo */}
      <div className="relative h-[65vh] w-full overflow-hidden bg-slate-200">
        <Image
          src={design.primary_photo_url}
          alt={design.title}
          fill
          className="object-cover"
          priority
        />

        {/* Product tag dots */}
        {design.product_tags.map((tag) => (
          <ProductTagDot key={tag.id} tag={tag} />
        ))}

        {/* Photo navigation dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {design.media_urls.map((_, i) => (
            <span
              key={i}
              className={cn(
                "size-2 rounded-full",
                i === 0 ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>

        {/* Photo nav arrows */}
        <button className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm">
          <ChevronLeft className="size-5" />
        </button>
        <button className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm">
          <ChevronRight className="size-5" />
        </button>

        {/* Floating action buttons */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
            <Heart className="size-4" /> {design.like_count.toLocaleString()}
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
            <Bookmark className="size-4" /> Save
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
            <Share2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Designer info bar */}
      <div className="border-b bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href={`/designers/${design.designer?.id}`} className="flex items-center gap-3">
            <Image
              src={design.designer?.avatar_url ?? ""}
              alt={design.designer?.display_name ?? ""}
              width={48}
              height={48}
              className="size-12 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{design.designer?.display_name}</span>
                {design.designer && <DesignerBadge tier={design.designer.designer_tier} size="md" />}
              </div>
              <p className="text-sm text-slate-500">
                <Star className="mr-0.5 inline size-3.5 fill-amber-500 text-amber-500" />
                {design.designer?.rating_avg} ({design.designer?.review_count} reviews) &middot; {formatLabel(design.style)} &middot; {formatLabel(design.room_type)} Specialist
              </p>
            </div>
          </Link>
          <div className="hidden gap-2 sm:flex">
            <Button variant="outline">Follow</Button>
            <Link href={`/designers/${design.designer?.id}`}>
              <Button>Hire {design.designer?.display_name.split(" ")[0]} &rarr;</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Two-column content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left column (60%) */}
          <div className="space-y-6 lg:col-span-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">{design.title}</h1>

            {/* Metadata pills */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{formatLabel(design.room_type)}</Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{formatLabel(design.style)}</Badge>
              <Badge variant="secondary" className={difficultyStyles[design.difficulty_level]}>\uD83D\uDCD0 {formatLabel(design.difficulty_level)}</Badge>
              {design.is_diy_friendly && <Badge variant="secondary" className="bg-green-100 text-green-700">\u2713 DIY Friendly</Badge>}
              {design.estimated_cost != null && <Badge variant="secondary" className="bg-slate-100 text-slate-700">\uD83D\uDCB0 ~${design.estimated_cost.toLocaleString()}</Badge>}
            </div>

            {/* Description */}
            <div className="space-y-3 text-base leading-relaxed text-slate-700 whitespace-pre-line">
              {design.description}
            </div>

            {/* Tags */}
            {design.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {design.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right column — Shopping list (40%) */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24 border-l-4 border-l-primary shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="size-5" /> Products Used ({design.product_tags.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {design.product_tags.length > 0 ? (
                  <>
                    {design.product_tags.map((tag, i) => (
                      <div key={tag.id} className={cn("flex items-center gap-3 py-3", i > 0 && "border-t")}>
                        {tag.product_image_url && (
                          <Image
                            src={tag.product_image_url}
                            alt={tag.product_name}
                            width={48}
                            height={48}
                            className="size-12 rounded-md object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">{tag.product_name}</p>
                          <p className="text-xs text-slate-500">{tag.product_brand}{tag.retailer_name && <> &middot; {tag.retailer_name}</>}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-primary">${tag.estimated_price.toFixed(2)}</p>
                          {tag.product_url && <a href={tag.product_url} className="text-xs font-medium text-primary hover:underline">Buy &rarr;</a>}
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="font-semibold text-slate-800">Estimated Total</span>
                        <span className="text-lg font-bold text-primary">~${design.estimated_cost?.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-400">Prices compared across 4 retailers</p>
                      <Button className="w-full">
                        <ShoppingCart className="mr-2 size-4" /> Shop All Items
                      </Button>
                      <Button variant="outline" className="w-full">
                        Generate Full Material List &rarr;
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="py-4 text-center text-sm text-slate-400">
                    Product tags coming soon for this design.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Services section */}
      {services.length > 0 && (
        <div className="bg-slate-50 px-4 py-10 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-bold text-slate-800">Work with {design.designer?.display_name}</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {services.slice(0, 3).map((service) => (
                <Card key={service.id} className="min-w-[260px] shrink-0">
                  <CardContent className="space-y-2 p-5">
                    <h3 className="font-semibold text-slate-800">{service.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{service.description}</p>
                    <p className="text-xs text-slate-400">
                      \uD83D\uDCE6 {service.estimated_delivery_days === 0 ? "Same day" : `${service.estimated_delivery_days} day${service.estimated_delivery_days > 1 ? "s" : ""}`} {service.max_revisions > 0 && `\u00b7 \uD83D\uDD04 ${service.max_revisions} revision${service.max_revisions > 1 ? "s" : ""}`}
                    </p>
                    <p className="text-xl font-bold text-primary">${service.price}</p>
                    <Button size="sm" className="w-full">Book Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related designs */}
      {relatedDesigns.length > 0 && (
        <div className="px-4 py-10 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Similar Designs You Might Love</h2>
              <Link href="/designs" className="text-sm font-medium text-primary hover:underline">
                View All {formatLabel(design.room_type)} Designs &rarr;
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {relatedDesigns.map((d) => (
                <div key={d.id} className="w-[220px] shrink-0">
                  <GalleryCard design={d} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
