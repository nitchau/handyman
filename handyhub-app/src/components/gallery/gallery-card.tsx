"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { DesignerBadge } from "./designer-badge";
import { Difficulty, type DesignIdea } from "@/types/database";
import { Badge } from "@/components/ui/badge";

interface GalleryCardProps {
  readonly design: DesignIdea;
  readonly className?: string;
}

const difficultyStyles: Record<Difficulty, string> = {
  [Difficulty.BEGINNER]: "bg-green-100 text-green-700",
  [Difficulty.INTERMEDIATE]: "bg-amber-100 text-amber-700",
  [Difficulty.ADVANCED]: "bg-red-100 text-red-700",
};

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function GalleryCard({ design, className }: GalleryCardProps) {
  const roomLabel = design.room_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const styleLabel = design.style.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Link href={`/designs/${design.id}`} className={cn("group block", className)}>
      <article
        className={cn(
          "overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md",
          design.is_featured && "ring-2 ring-amber-300"
        )}
      >
        {/* Photo */}
        <div className="relative overflow-hidden">
          <Image
            src={design.photos[0]}
            alt={design.title}
            width={400}
            height={500}
            className="h-auto w-full object-cover"
          />

          {/* Hover overlay (desktop) */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
            <span className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-slate-800">
              View Design &rarr;
            </span>
          </div>

          {/* Heart button — always visible on mobile, hover on desktop */}
          <button
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="size-4" />
          </button>

          {/* Before/After badge */}
          {design.before_photo && (
            <Badge className="absolute left-2 top-2 bg-primary text-white">Before/After</Badge>
          )}
        </div>

        {/* Info area */}
        <div className="space-y-1.5 p-3">
          {/* Designer row */}
          <div className="flex items-center gap-1.5">
            <Image
              src={design.designer.avatar_url}
              alt={design.designer.name}
              width={20}
              height={20}
              className="size-5 rounded-full object-cover"
            />
            <span className="truncate text-xs text-slate-600">{design.designer.name}</span>
            <DesignerBadge tier={design.designer.tier} size="sm" />
          </div>

          {/* Title + budget */}
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">
            {design.title} &mdash; ${design.budget.toLocaleString()}
          </h3>

          {/* Pills + stats */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              {roomLabel}
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              {styleLabel}
            </span>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", difficultyStyles[design.difficulty])}>
              {design.difficulty.charAt(0).toUpperCase() + design.difficulty.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-0.5">
              <Heart className="size-3" /> {formatCount(design.likes)}
            </span>
            <span className="flex items-center gap-0.5">
              <Bookmark className="size-3" /> {formatCount(design.saves)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
