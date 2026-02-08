"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { ProductTag } from "@/types/database";
import { Button } from "@/components/ui/button";

interface ProductTagDotProps {
  readonly tag: ProductTag;
}

export function ProductTagDot({ tag }: ProductTagDotProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="absolute z-10"
      style={{ left: `${tag.position_x}%`, top: `${tag.position_y}%` }}
    >
      {/* Dot */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex size-3.5 items-center justify-center"
      >
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/60" />
        <span className="relative inline-flex size-3 rounded-full border border-white/80 bg-white shadow-md" />
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute left-4 top-0 z-20 w-56 rounded-lg bg-white p-3 shadow-lg">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
          >
            <X className="size-3.5" />
          </button>
          <div className="flex gap-2.5">
            <Image
              src={tag.image_url}
              alt={tag.name}
              width={48}
              height={48}
              className="size-12 rounded-md object-cover"
            />
            <div className="flex-1 space-y-0.5">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{tag.name}</p>
              <p className="text-[11px] text-slate-500">
                {tag.brand} &middot; {tag.retailer}
              </p>
              <p className="text-sm font-semibold text-primary">{tag.price}</p>
            </div>
          </div>
          <Button size="sm" className="mt-2 h-7 w-full text-xs">
            Buy at {tag.retailer} &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}
