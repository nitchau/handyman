"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Star, Trash2, Pencil, ImagePlus, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RoomType, DesignStyle, Difficulty } from "@/types/database";

function formatLabel(val: string): string {
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const STEPS = [
  { num: 1, label: "Upload Photos" },
  { num: 2, label: "Project Details" },
  { num: 3, label: "Tag Products" },
];

interface TaggedProduct {
  name: string;
  brand: string;
  price: string;
  category: string;
}

export default function UploadDesignPage() {
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=400&fit=crop",
  ]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState(RoomType.LIVING_ROOM);
  const [style, setStyle] = useState(DesignStyle.MODERN);
  const [difficulty, setDifficulty] = useState(Difficulty.BEGINNER);
  const [diyFriendly, setDiyFriendly] = useState(true);
  const [tags, setTags] = useState<string[]>(["Renovation", "Color Pop"]);
  const [tagInput, setTagInput] = useState("");
  const [taggedProducts] = useState<TaggedProduct[]>([
    { name: "Velvet Sofa", brand: "West Elm", price: "$1,299", category: "Furniture" },
    { name: "Arc Floor Lamp", brand: "CB2", price: "$249", category: "Lighting" },
    { name: "Abstract Art Print", brand: "Minted", price: "$89", category: "Decor" },
  ]);

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    if (heroIndex >= newPhotos.length) setHeroIndex(0);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Upload New Design Idea</h2>
          <p className="mt-1 text-slate-500">Share your latest creation with the HandyHub community.</p>
        </div>
        <Button variant="outline">Save Draft</Button>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex flex-1 items-center gap-2">
            <div className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              step >= s.num ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
            )}>
              {step > s.num ? <Check className="size-4" /> : s.num}
            </div>
            <span className={cn("hidden text-sm font-medium sm:inline", step >= s.num ? "text-slate-900" : "text-slate-400")}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <div className="mx-2 h-px flex-1 bg-slate-200" />}
          </div>
        ))}
      </div>

      {/* Step 1: Upload Photos */}
      {step === 1 && (
        <Card>
          <CardContent className="space-y-6 p-6">
            {/* Drag & Drop Zone */}
            <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-10 text-center transition-colors hover:bg-primary/10">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                <ImagePlus className="size-7 text-primary" />
              </div>
              <h4 className="font-medium text-slate-900">Drag & drop photos here</h4>
              <p className="mb-4 text-sm text-slate-500">High-resolution images (PNG, JPG, WEBP) up to 20MB</p>
              <Button>Browse Files</Button>
            </div>

            {/* Thumbnails Grid */}
            {photos.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900">
                  Uploaded Photos ({photos.length})
                </h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {photos.map((photo, i) => (
                    <div key={i} className={cn("group relative aspect-square overflow-hidden rounded-lg", i === heroIndex ? "border-2 border-primary shadow-md" : "border border-slate-200")}>
                      <Image src={photo} alt={`Upload ${i + 1}`} fill className="object-cover" />
                      {i === heroIndex && (
                        <div className="absolute right-2 top-2 z-10 rounded-full bg-primary p-1 text-white shadow-sm">
                          <Star className="size-3" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        {i !== heroIndex && (
                          <button onClick={() => setHeroIndex(i)} className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm hover:bg-white/40">
                            <Star className="size-4" />
                          </button>
                        )}
                        <button onClick={() => removePhoto(i)} className="rounded-full bg-red-500/80 p-1.5 text-white backdrop-blur-sm hover:bg-red-500">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Before Photo */}
            <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white transition-colors hover:border-primary">
                <Upload className="size-5 text-slate-400" />
              </div>
              <div>
                <h5 className="text-sm font-medium text-slate-900">Before Transformation Photo (Optional)</h5>
                <p className="text-xs text-slate-500">Show the dramatic change by uploading the original state.</p>
              </div>
            </div>

            <div className="flex justify-end border-t pt-6">
              <Button onClick={() => setStep(2)}>
                Next Step <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Project Details */}
      {step === 2 && (
        <Card>
          <CardContent className="space-y-6 p-6">
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Design Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Mid-Century Modern Living Room Refresh"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the design concept, inspiration, and key elements..."
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Dropdowns Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Room Type</label>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value as RoomType)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm">
                  {Object.values(RoomType).map((rt) => <option key={rt} value={rt}>{formatLabel(rt)}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value as DesignStyle)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm">
                  {Object.values(DesignStyle).map((s) => <option key={s} value={s}>{formatLabel(s)}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Budget</label>
                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm">
                  <option>$1,000 - $5,000</option>
                  <option>$5,000 - $10,000</option>
                  <option>$10,000+</option>
                </select>
              </div>
            </div>

            {/* Difficulty + DIY Toggle */}
            <div className="flex flex-col justify-between gap-6 pt-2 sm:flex-row sm:items-center">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Project Difficulty</label>
                <div className="flex items-center gap-2">
                  {Object.values(Difficulty).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                        difficulty === d ? "border-primary bg-primary/10 text-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {formatLabel(d)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div>
                  <span className="text-sm font-medium text-slate-900">DIY Friendly?</span>
                  <p className="text-xs text-slate-500">Is this executable by owners?</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" checked={diyFriendly} onChange={(e) => setDiyFriendly(e.target.checked)} className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                </label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Tags</label>
              <div className="flex min-h-[50px] flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 text-slate-400 hover:text-slate-600"><X className="size-3" /></button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="min-w-[120px] border-none bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:ring-0"
                />
              </div>
            </div>

            <div className="flex justify-between border-t pt-6">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>
                Next Step <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Tag Products */}
      {step === 3 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Image Preview */}
              <div className="w-full lg:w-3/5">
                <p className="mb-3 text-sm text-slate-500">Click on the photo to tag a product.</p>
                <div className="relative cursor-crosshair overflow-hidden rounded-xl shadow-lg">
                  {photos[heroIndex] && (
                    <Image
                      src={photos[heroIndex]}
                      alt="Design preview"
                      width={600}
                      height={400}
                      className="w-full object-cover"
                    />
                  )}
                  {/* Tag dots */}
                  <div className="absolute left-[30%] top-[45%] size-6 animate-pulse cursor-pointer rounded-full border-2 border-primary bg-white shadow-lg transition-transform hover:scale-110" />
                  <div className="absolute left-[60%] top-[65%] size-4 cursor-pointer rounded-full bg-white/80 shadow-md transition-all hover:scale-125 hover:bg-white" />
                  <div className="absolute right-[20%] top-[35%] size-4 cursor-pointer rounded-full bg-white/80 shadow-md transition-all hover:scale-125 hover:bg-white" />
                </div>
              </div>

              {/* Product Form */}
              <div className="flex w-full flex-col lg:w-2/5">
                <h4 className="mb-4 text-sm font-bold text-slate-900">Product Details</h4>
                <div className="mb-6 space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Product Name</label>
                    <input type="text" defaultValue="Emerald Velvet Sofa" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Brand</label>
                      <input type="text" defaultValue="West Elm" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Price</label>
                      <input type="text" defaultValue="$1,299" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Category</label>
                    <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm">
                      <option>Furniture</option>
                      <option>Lighting</option>
                      <option>Decor</option>
                      <option>Fixtures</option>
                      <option>Flooring</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Product URL</label>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-100 px-3 text-xs text-slate-500">https://</span>
                      <input type="text" placeholder="www.store.com/item" className="min-w-0 flex-1 rounded-none rounded-r-lg border border-slate-200 bg-white px-3 py-1.5 text-sm" />
                    </div>
                  </div>
                  <Button className="w-full">Save Product Tag</Button>
                </div>

                {/* Tagged Items List */}
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tagged Items ({taggedProducts.length})</h5>
                <ul className="space-y-3">
                  {taggedProducts.map((product, i) => (
                    <li key={i} className="group flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-500">{i + 1}</div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.price} &middot; {product.brand}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button className="text-slate-400 hover:text-primary"><Pencil className="size-4" /></button>
                        <button className="text-slate-400 hover:text-red-500"><Trash2 className="size-4" /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-between border-t pt-6">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button>
                Finish & Publish <Check className="ml-2 size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
