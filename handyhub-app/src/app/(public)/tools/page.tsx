"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MapPin, Star, SlidersHorizontal, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toolListings, toolCategories } from "@/data/contractor-data";

const HOW_IT_WORKS = [
  { step: 1, title: "Browse & Reserve", description: "Find the right tool and check availability for your project dates. Pay securely through our platform.", icon: "search" },
  { step: 2, title: "Pick Up or Deliver", description: "Coordinate a pickup with the owner or opt for our convenient local delivery service right to your door.", icon: "handshake" },
  { step: 3, title: "Return When Done", description: "Drop the tool back to the owner once you've finished your project. Leave a review to help others.", icon: "check" },
];

export default function ToolRentalPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = toolListings.filter(
    (t) =>
      (activeCategory === "all" || t.category.toLowerCase().includes(activeCategory.toLowerCase())) &&
      (searchQuery === "" || t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 px-6 py-16">
        <div className="mx-auto max-w-[1280px] text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-6xl">Rent Pro Tools, Save Big</h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-emerald-50">
            Professional equipment at your fingertips. Rent locally from neighbors and save up to 70% on your next project.
          </p>

          {/* Search bar */}
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 rounded-xl bg-white p-2 shadow-2xl md:flex-row">
            <div className="flex w-full flex-1 items-center gap-3 border-b px-4 md:border-b-0 md:border-r">
              <Search className="size-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-none py-3 text-slate-900 placeholder:text-slate-400 focus:ring-0"
                placeholder="Search for a tool (e.g. Hammer Drill)"
              />
            </div>
            <div className="flex w-full items-center gap-3 px-4 md:w-48">
              <MapPin className="size-5 text-slate-400" />
              <input
                type="text"
                defaultValue="94102"
                className="w-full border-none py-3 text-slate-900 placeholder:text-slate-400 focus:ring-0"
                placeholder="ZIP code"
              />
            </div>
            <Button className="w-full px-8 py-3 font-bold md:w-auto">Search</Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
            {["Free Delivery", "Same-Day Pickup", "Insured Rentals"].map((label) => (
              <div key={label} className="flex items-center gap-3 text-emerald-100">
                <div className="rounded-full bg-emerald-400/20 p-2">
                  <Wrench className="size-5 text-emerald-200" />
                </div>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1280px] px-6 py-12">
        {/* Categories */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Popular Categories</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl border-2 px-6 py-3 font-bold transition-all",
                activeCategory === "all"
                  ? "border-primary bg-primary text-white"
                  : "border-transparent bg-white text-slate-600 hover:border-primary/50"
              )}
            >
              All
            </button>
            {toolCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.label)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl border-2 px-6 py-3 font-semibold transition-all",
                  activeCategory === cat.label
                    ? "border-primary bg-primary text-white"
                    : "border-transparent bg-white text-slate-600 hover:border-primary/50"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Tool grid */}
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Available Near You</h2>
            <div className="flex gap-2">
              <button className="rounded-lg border p-2 transition-colors hover:bg-white">
                <SlidersHorizontal className="size-5 text-slate-600" />
              </button>
              <select className="rounded-lg border bg-slate-50 text-sm font-semibold text-slate-600 focus:ring-primary">
                <option>Sort by: Newest</option>
                <option>Sort by: Price (Low to High)</option>
                <option>Sort by: Distance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTools.map((tool) => (
              <Card key={tool.id} className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={tool.image_url}
                    alt={tool.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 backdrop-blur-sm">
                    {tool.category}
                  </div>
                  <div
                    className={cn(
                      "absolute right-3 top-3 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                      tool.available ? "bg-primary text-white" : "bg-amber-500 text-white"
                    )}
                  >
                    {tool.available ? "Available" : `Available ${tool.available_date}`}
                  </div>
                </div>
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-bold text-slate-900 transition-colors group-hover:text-emerald-600">{tool.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="size-3.5 fill-amber-500" />
                      <span className="text-xs font-bold text-slate-600">{tool.rating}</span>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="size-3" />
                    {tool.distance_miles} miles away
                  </div>
                  <div className="mt-auto">
                    <div className="mb-4 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">${tool.price_per_day}</span>
                      <span className="text-xs font-semibold text-slate-500">/day</span>
                    </div>
                    <Button className="w-full font-bold" disabled={!tool.available}>
                      {tool.available ? "Rent Now" : "Notify Me"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="font-bold">
              Load More Tools
            </Button>
          </div>
        </section>

        {/* How it works */}
        <section className="-mx-6 rounded-xl bg-slate-100 px-12 py-16 md:mx-0">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black">How HandyHub Works</h2>
            <p className="mx-auto max-w-xl text-slate-600">
              Get the professional equipment you need for your DIY projects in three simple steps.
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center">
                <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl bg-white shadow-xl">
                  <span className="absolute -left-3 -top-3 flex size-8 items-center justify-center rounded-full bg-primary font-bold text-white">
                    {step.step}
                  </span>
                  <Wrench className="size-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-20">
          <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-xl bg-slate-900 p-12 md:flex-row">
            <div className="absolute right-0 top-0 h-full w-1/3 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative z-10 text-center md:text-left">
              <h2 className="mb-4 text-3xl font-black text-white">Have Tools Sitting Idle?</h2>
              <p className="max-w-lg text-lg text-slate-400">
                Join thousands of tool owners earning an average of $350/month by renting out their equipment.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <Button size="lg" className="px-12 py-5 text-lg font-black shadow-xl">
                Start Earning Now
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
