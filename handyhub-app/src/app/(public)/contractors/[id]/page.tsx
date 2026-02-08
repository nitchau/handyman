"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, CheckCircle, Calendar, Shield, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { contractors, contractorReviews } from "@/data/contractor-data";

interface ContractorProfilePageProps {
  readonly params: Promise<{ id: string }>;
}

const SERVICE_OPTIONS = ["Select a service...", "Kitchen Remodel", "Bathroom Upgrade", "Flooring/Tiling", "Carpentry/Cabinets", "General Repair"];
const TIMELINE_OPTIONS = ["ASAP", "Within 2 weeks", "1-3 months", "Flexible"];

export default function ContractorProfilePage({ params }: ContractorProfilePageProps) {
  const { id } = use(params);
  const contractor = contractors.find((c) => c.id === id) ?? contractors[0];
  const reviews = contractorReviews;

  const [activeTab, setActiveTab] = useState<"about" | "services" | "portfolio" | "reviews">("about");

  const stats = [
    { label: "Reviews", value: contractor.review_count.toString() },
    { label: "Years Exp.", value: `${contractor.years_experience}+` },
    { label: "Hourly Rate", value: `$${contractor.hourly_rate}-${contractor.hourly_rate + 10}` },
    { label: "Completion", value: `${contractor.completion_rate}%` },
  ];

  const ratingBreakdown = [
    { stars: 5, count: Math.round(contractor.review_count * 0.88) },
    { stars: 4, count: Math.round(contractor.review_count * 0.1) },
    { stars: 3, count: Math.round(contractor.review_count * 0.02) },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Cover section */}
      <section className="relative overflow-hidden rounded-b-xl bg-white shadow-sm">
        <div className="relative h-[280px] w-full overflow-hidden bg-slate-300">
          <Image src={contractor.cover_url} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="relative z-10 -mt-12 flex flex-col items-end gap-6 px-8 pb-8 md:flex-row">
          <Image
            src={contractor.avatar_url}
            alt={contractor.name}
            width={128}
            height={128}
            className="size-32 rounded-full border-4 border-white object-cover shadow-md"
          />
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-800">{contractor.name}</h1>
              {contractor.verified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  <Shield className="size-3.5" /> FULLY VERIFIED
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-4 text-slate-600">
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-slate-900">{contractor.rating_avg}</span>
                <span className="text-sm">({contractor.review_count} reviews)</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-4" /> {contractor.location}
              </span>
            </div>
          </div>
          <div className="flex gap-3 pb-2">
            <Button className="shadow-lg">Get Free Quote</Button>
            <Button variant="outline">Message</Button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mx-auto mt-6 grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center rounded-xl border bg-slate-50 p-6">
            <span className="text-sm font-medium text-slate-500">{stat.label}</span>
            <span className="text-2xl font-bold">{stat.value}</span>
          </div>
        ))}
      </section>

      {/* Tab navigation */}
      <div className="sticky top-0 z-20 mt-8 border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-8 px-4">
          {(["about", "services", "portfolio", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "py-4 text-sm font-bold uppercase tracking-wide transition-colors",
                activeTab === tab ? "border-b-[3px] border-primary text-primary" : "text-slate-500 hover:text-primary"
              )}
            >
              {tab === "services" ? "Services & Pricing" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content + sidebar */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-12 lg:col-span-2">
          {/* About tab */}
          {activeTab === "about" && (
            <>
              <section>
                <h3 className="mb-4 text-xl font-bold">About {contractor.name.split(" ")[0]}</h3>
                <p className="mb-6 leading-relaxed text-slate-600">{contractor.bio}</p>
                <div className="mb-8 flex flex-wrap gap-2">
                  {contractor.specialties.map((s) => (
                    <span key={s} className="rounded-full bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                      {s}
                    </span>
                  ))}
                </div>
                <div>
                  <h4 className="mb-4 flex items-center gap-2 font-bold">
                    <CheckCircle className="size-5 text-primary" /> Credentials
                  </h4>
                  <ul className="space-y-3">
                    {contractor.credentials.map((cred) => (
                      <li key={cred} className="flex items-center gap-3">
                        <CheckCircle className="size-5 text-primary" />
                        <span className="text-sm font-medium">{cred}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Availability */}
              <section>
                <h4 className="mb-4 flex items-center gap-2 font-bold">
                  <Calendar className="size-5 text-primary" /> Weekly Availability
                </h4>
                <div className="grid grid-cols-7 gap-2">
                  {contractor.availability.map((a) => (
                    <div key={a.day} className="text-center">
                      <div className="py-2 text-xs font-bold uppercase text-slate-400">{a.day}</div>
                      <div
                        className={cn(
                          "flex h-12 items-center justify-center rounded text-[10px] font-bold",
                          a.hours === "Closed"
                            ? "border border-dashed border-slate-300 bg-slate-100 text-slate-400"
                            : "border border-primary/30 bg-primary/20 text-primary"
                        )}
                      >
                        {a.hours}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Portfolio tab */}
          {activeTab === "portfolio" && (
            <section>
              <h3 className="mb-6 text-xl font-bold">Portfolio</h3>
              {contractor.portfolio.length === 0 ? (
                <p className="text-slate-500">No portfolio items yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {contractor.portfolio.map((p) => (
                    <Card key={p.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                        <div className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-md">
                          {p.category}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h5 className="mb-1 text-sm font-bold">{p.title}</h5>
                        <p className="text-xs text-slate-500">
                          {p.location} \u00b7 {p.year}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <section>
              <h3 className="mb-8 text-xl font-bold">Client Reviews</h3>
              {/* Rating summary */}
              <div className="mb-12 grid gap-8 md:grid-cols-5">
                <div className="flex flex-col items-center justify-center rounded-xl border bg-slate-50 p-8 md:col-span-2">
                  <span className="mb-2 text-5xl font-black">{contractor.rating_avg}</span>
                  <div className="mb-2 flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={cn("size-5", s <= Math.round(contractor.rating_avg) ? "fill-yellow-500" : "")} />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-500">{contractor.review_count} Total Reviews</span>
                </div>
                <div className="space-y-2 py-2 md:col-span-3">
                  {ratingBreakdown.map((row) => (
                    <div key={row.stars} className={cn("flex items-center gap-4", row.count === 0 && "opacity-30")}>
                      <span className="w-12 text-right text-xs font-bold text-slate-400">{row.stars} stars</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${contractor.review_count > 0 ? (row.count / contractor.review_count) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="w-8 text-xs font-bold">{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual reviews */}
              <div className="space-y-8">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-8 last:border-0">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-500">
                          {review.client_initials}
                        </div>
                        <div>
                          <h6 className="text-sm font-bold">{review.client_name}</h6>
                          <p className="text-xs text-slate-400">
                            {review.date} \u00b7 {review.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={cn("size-3.5", s <= review.rating ? "fill-yellow-500" : "")} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{review.text}</p>
                    {review.reply && (
                      <div className="ml-4 mt-4 rounded-xl border-l-4 border-primary bg-slate-50 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary">Reply from {contractor.name.split(" ")[0]}</span>
                        </div>
                        <p className="text-xs text-slate-600">{review.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Services tab */}
          {activeTab === "services" && (
            <section>
              <h3 className="mb-6 text-xl font-bold">Services & Pricing</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {contractor.specialties.map((s) => (
                  <Card key={s}>
                    <CardContent className="p-5">
                      <h4 className="mb-2 font-semibold">{s}</h4>
                      <p className="mb-3 text-sm text-slate-500">Professional {s.toLowerCase()} services for residential and commercial properties.</p>
                      <p className="mb-4 text-xl font-bold text-primary">From ${contractor.hourly_rate}/hr</p>
                      <Button className="w-full">Book Now</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside>
          <div className="sticky top-20">
            <Card className="overflow-hidden border-l-[8px] border-l-primary shadow-xl">
              <CardContent className="p-0">
                <div className="border-b p-6">
                  <h4 className="text-xl font-bold">Get a Free Quote</h4>
                  <p className="mt-1 text-sm text-slate-500">
                    {contractor.name.split(" ")[0]} usually responds in <span className="font-bold text-primary">under 2 hours</span>.
                  </p>
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Project Category</label>
                    <select className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-primary focus:ring-primary">
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Describe Your Project</label>
                    <textarea
                      className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-primary focus:ring-primary"
                      placeholder="What needs to be done?"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Timeline</label>
                      <select className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-primary focus:ring-primary">
                        {TIMELINE_OPTIONS.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">ZIP Code</label>
                      <input
                        type="text"
                        defaultValue="94102"
                        className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  <Button className="w-full py-4 font-bold shadow-lg">Request Quote</Button>
                  <p className="text-center text-[10px] text-slate-400">
                    No credit card required. Requesting a quote does not commit you to hire.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
                <Shield className="size-4 text-primary" />
                <span className="text-[10px] font-bold uppercase">Verified Identity</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
                <Shield className="size-4 text-primary" />
                <span className="text-[10px] font-bold uppercase">HandyHub Protection</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
