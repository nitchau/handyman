"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Upload, X, Shield, Lock, Star, ThumbsUp, ThumbsDown, Plus, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RoomType } from "@/types/database";
import { designers, designerServices } from "@/data/gallery-data";

interface BookingPageProps {
  readonly params: Promise<{ serviceId: string }>;
}

function formatLabel(val: string): string {
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const STYLE_OPTIONS = ["Modern", "Farmhouse", "Scandinavian", "Industrial", "Bohemian", "Coastal", "Minimalist"];

export default function BookingPage({ params }: BookingPageProps) {
  const { serviceId } = use(params);
  const service = designerServices.find((s) => s.id === serviceId) ?? designerServices[1];
  const designer = designers.find((d) => d.id === service.designer_id) ?? designers[0];

  const [roomType, setRoomType] = useState(RoomType.BATHROOM);
  const [dimensions, setDimensions] = useState({ length: 12, width: 8, height: 0 });
  const [styleLikes, setStyleLikes] = useState<string[]>(["Modern", "Farmhouse"]);
  const [styleDislikes, setStyleDislikes] = useState<string[]>(["Industrial"]);
  const [budget, setBudget] = useState(3000);
  const [notes, setNotes] = useState("");

  const toggleStyle = (style: string, type: "like" | "dislike") => {
    if (type === "like") {
      setStyleDislikes(styleDislikes.filter((s) => s !== style));
      setStyleLikes(styleLikes.includes(style) ? styleLikes.filter((s) => s !== style) : [...styleLikes, style]);
    } else {
      setStyleLikes(styleLikes.filter((s) => s !== style));
      setStyleDislikes(styleDislikes.includes(style) ? styleDislikes.filter((s) => s !== style) : [...styleDislikes, style]);
    }
  };

  const platformFee = 0;
  const total = service.price + platformFee;

  return (
    <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6">
      {/* Back link */}
      <div className="mb-6">
        <Link href={`/designers/${designer.id}`} className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-primary">
          <ArrowLeft className="size-4" /> Back to {designer.display_name}&apos;s Profile
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Complete Your Booking</h1>
        <p className="text-slate-500">Provide details for your project to get started with {designer.display_name}.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Booking Form */}
        <div className="space-y-6 lg:col-span-8">
          {/* Progress Stepper */}
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</div>
                <span className="text-sm font-medium text-slate-900">Project Details</span>
              </div>
              <div className="mx-4 h-px flex-1 bg-slate-200" />
              <div className="flex items-center gap-3 opacity-50">
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">2</div>
                <span className="text-sm font-medium">Payment</span>
              </div>
              <div className="mx-4 h-px flex-1 bg-slate-200" />
              <div className="flex items-center gap-3 opacity-50">
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">3</div>
                <span className="text-sm font-medium">Confirm</span>
              </div>
            </CardContent>
          </Card>

          {/* Main Form */}
          <Card>
            <CardContent className="space-y-8 p-6 md:p-8">
              {/* Room Type */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as RoomType)}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:border-primary focus:ring-primary"
                >
                  {Object.values(RoomType).map((rt) => (
                    <option key={rt} value={rt}>{formatLabel(rt)}</option>
                  ))}
                </select>
              </div>

              {/* Photos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Photos of Your Space</label>
                  <span className="text-xs text-slate-400">Max 10MB per file</span>
                </div>
                <div className="group cursor-pointer rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-6 text-center transition-colors hover:bg-emerald-50">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-sm transition-transform group-hover:scale-110">
                    <Upload className="size-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Click or drag photos here</p>
                  <p className="mt-1 text-xs text-slate-500">JPG, PNG, HEIC accepted</p>
                </div>
              </div>

              {/* Room Dimensions */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Room Dimensions (ft)</label>
                <div className="grid grid-cols-3 gap-4">
                  {(["length", "width", "height"] as const).map((dim) => (
                    <div key={dim} className="relative">
                      <input
                        type="number"
                        value={dimensions[dim] || ""}
                        onChange={(e) => setDimensions({ ...dimensions, [dim]: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:border-primary focus:ring-primary"
                      />
                      <span className="absolute right-4 top-3 text-sm text-slate-400">{dim[0].toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Style Preferences */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Style Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {styleLikes.map((s) => (
                    <button key={`like-${s}`} onClick={() => toggleStyle(s, "like")} className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100">
                      <ThumbsUp className="size-3.5" /> {s} <X className="ml-1 size-3 opacity-50" />
                    </button>
                  ))}
                  {styleDislikes.map((s) => (
                    <button key={`dislike-${s}`} onClick={() => toggleStyle(s, "dislike")} className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100">
                      <ThumbsDown className="size-3.5" /> {s} <X className="ml-1 size-3 opacity-50" />
                    </button>
                  ))}
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        if (e.target.value) toggleStyle(e.target.value, "like");
                        e.target.value = "";
                      }}
                      className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-500 transition-colors hover:border-primary hover:text-primary"
                    >
                      <option value="">+ Add Style</option>
                      {STYLE_OPTIONS.filter((s) => !styleLikes.includes(s) && !styleDislikes.includes(s)).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Budget Slider */}
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <label className="block text-sm font-medium text-slate-700">Approximate Budget</label>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-primary">
                    ${budget.toLocaleString()}
                  </div>
                </div>
                <input
                  type="range"
                  min={500}
                  max={10000}
                  step={100}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>$500</span>
                  <span>$10,000+</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Additional Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={`Is there anything specific you want ${designer.display_name.split(" ")[0]} to know about your routine or needs?`}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              {/* Reference Inspiration */}
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <label className="block text-sm font-medium text-slate-700">Reference Inspiration (Optional)</label>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm"><Upload className="mr-2 size-4" /> Upload Image</Button>
                  <Button variant="outline" size="sm"><Plus className="mr-2 size-4" /> Paste Pinterest Link</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-4">
            {/* Order Summary */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                {/* Designer Profile */}
                <div className="mb-6 flex items-center gap-3 border-b pb-6">
                  <div className="relative">
                    <Image
                      src={designer.avatar_url ?? ""}
                      alt={designer.display_name}
                      width={56}
                      height={56}
                      className="size-14 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="size-3" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{designer.display_name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5 font-bold text-yellow-500">
                        <Star className="size-3.5 fill-yellow-500" /> {designer.rating_avg}
                      </span>
                      <span>&middot;</span>
                      <span>Certified Pro</span>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="mb-6 space-y-4">
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Service</p>
                    <p className="text-sm font-medium text-slate-900">{service.title}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Delivery</p>
                      <p className="text-sm text-slate-700">{service.estimated_delivery_days === 0 ? "Same day" : `${service.estimated_delivery_days} day${service.estimated_delivery_days > 1 ? "s" : ""}`}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Revisions</p>
                      <p className="text-sm text-slate-700">{service.max_revisions > 0 ? `${service.max_revisions} Included` : "None"}</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-6 space-y-2 rounded-lg bg-slate-50 p-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>${service.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Platform Fee</span>
                    <span className="font-medium text-primary">$0.00</span>
                  </div>
                  <div className="my-2 h-px bg-slate-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* CTA */}
                <Button className="mb-4 w-full py-3.5 text-base font-bold shadow-md">
                  Place Order &mdash; ${total.toFixed(0)}
                </Button>

                {/* Trust Badges */}
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Shield className="size-4 text-primary" />
                    <span>100% Escrow Protection</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Lock className="size-4 text-slate-400" />
                    <span>Secure SSL Checkout</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Box */}
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center">
              <p className="mb-2 text-xs text-slate-500">Questions about this service?</p>
              <Link href={`/designers/${designer.id}`} className="flex items-center justify-center gap-1 text-xs font-bold text-primary hover:underline">
                <MessageSquare className="size-3.5" /> Message {designer.display_name.split(" ")[0]}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
