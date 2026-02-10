"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin, Shield, ShieldCheck, ArrowLeft, Loader2, Briefcase, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TIMELINE_OPTIONS } from "@/lib/validations/quote";

interface ContractorProfile {
  id: string;
  user_id: string;
  business_name: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  years_experience: number;
  hourly_rate: number | null;
  service_radius_miles: number;
  verification_tier: string;
  license_number: string | null;
  insurance_verified: boolean;
  rating_avg: number;
  review_count: number;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  categories: { name: string; slug: string }[];
}

interface ContractorProfilePageProps {
  readonly params: Promise<{ id: string }>;
}

const VERIFICATION_LABELS: Record<string, string> = {
  fully_verified: "Fully Verified",
  background_checked: "Background Checked",
  id_verified: "ID Verified",
};

function VerificationBadge({ tier }: { tier: string }) {
  const label = VERIFICATION_LABELS[tier];
  if (!label) return null;

  const isTop = tier === "fully_verified" || tier === "background_checked";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold",
        isTop
          ? "border border-primary/20 bg-primary/10 text-primary"
          : "border border-blue-200 bg-blue-50 text-blue-600"
      )}
    >
      {isTop ? (
        <ShieldCheck className="size-3.5" />
      ) : (
        <Shield className="size-3.5" />
      )}
      {label.toUpperCase()}
    </span>
  );
}

export default function ContractorProfilePage({ params }: ContractorProfilePageProps) {
  const { id } = use(params);
  const [contractor, setContractor] = useState<ContractorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quote form state
  const [quoteDescription, setQuoteDescription] = useState("");
  const [quoteTimeline, setQuoteTimeline] = useState<string>(TIMELINE_OPTIONS[0]);
  const [quoteZip, setQuoteZip] = useState("");
  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteResult, setQuoteResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    async function fetchContractor() {
      try {
        const res = await fetch(`/api/contractors/${id}`);
        if (!res.ok) {
          setError("Contractor not found");
          return;
        }
        const data = await res.json();
        setContractor(data);
      } catch {
        setError("Failed to load contractor");
      } finally {
        setLoading(false);
      }
    }
    fetchContractor();
  }, [id]);

  async function handleQuoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuoteSubmitting(true);
    setQuoteResult(null);

    try {
      const res = await fetch(`/api/contractors/${id}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: quoteDescription,
          timeline: quoteTimeline,
          zip_code: quoteZip,
          sender_name: quoteName,
          sender_email: quoteEmail,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data.issues
            ? Object.values(data.issues as Record<string, string[]>).flat().join(". ")
            : data.error || "Something went wrong. Please try again.";
        setQuoteResult({ ok: false, message: msg });
        return;
      }

      setQuoteResult({ ok: true, message: "Quote request sent! The contractor will be in touch." });
      setQuoteDescription("");
      setQuoteTimeline(TIMELINE_OPTIONS[0]);
      setQuoteZip("");
      setQuoteName("");
      setQuoteEmail("");
    } catch {
      setQuoteResult({ ok: false, message: "Network error. Please try again." });
    } finally {
      setQuoteSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !contractor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Contractor Not Found</h1>
        <p className="text-slate-500">This profile doesn&apos;t exist or may have been removed.</p>
        <Link href="/contractors">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="size-4" /> Back to Search
          </Button>
        </Link>
      </div>
    );
  }

  const initials = contractor.display_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberSince = new Date(contractor.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-white border-b">
        {/* Back link */}
        <div className="mx-auto max-w-5xl px-4 pt-4">
          <Link
            href="/contractors"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Search
          </Link>
        </div>

        {/* Profile header */}
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row md:items-start">
          {/* Avatar */}
          <div className="shrink-0">
            {contractor.avatar_url ? (
              <img
                src={contractor.avatar_url}
                alt={contractor.display_name}
                className="size-24 rounded-full border-4 border-white object-cover shadow-md md:size-28"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full border-4 border-white bg-primary/10 text-2xl font-bold text-primary shadow-md md:size-28">
                {initials}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                {contractor.business_name || contractor.display_name}
              </h1>
              <VerificationBadge tier={contractor.verification_tier} />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              {contractor.rating_avg > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-slate-900">{Number(contractor.rating_avg).toFixed(1)}</span>
                  <span>({contractor.review_count} reviews)</span>
                </span>
              )}
              {contractor.years_experience > 0 && (
                <span className="flex items-center gap-1">
                  <Briefcase className="size-4" />
                  {contractor.years_experience}+ years
                </span>
              )}
              {contractor.hourly_rate != null && (
                <span className="flex items-center gap-1">
                  <Clock className="size-4" />
                  ${Number(contractor.hourly_rate).toFixed(0)}/hr
                </span>
              )}
              {contractor.latitude != null && contractor.longitude != null && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  Portland, OR area
                </span>
              )}
            </div>

            {/* Category pills */}
            {contractor.categories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {contractor.categories.map((cat) => (
                  <span
                    key={cat.slug}
                    className="rounded-full bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 shrink-0">
            <Button
              className="shadow-lg"
              onClick={() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get Free Quote
            </Button>
            <Button variant="outline">Message</Button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
        {contractor.review_count > 0 && (
          <div className="flex flex-col items-center rounded-xl border bg-slate-50 p-6">
            <span className="text-sm font-medium text-slate-500">Reviews</span>
            <span className="text-2xl font-bold">{contractor.review_count}</span>
          </div>
        )}
        {contractor.rating_avg > 0 && (
          <div className="flex flex-col items-center rounded-xl border bg-slate-50 p-6">
            <span className="text-sm font-medium text-slate-500">Rating</span>
            <span className="text-2xl font-bold flex items-center gap-1">
              {Number(contractor.rating_avg).toFixed(1)}
              <Star className="size-5 fill-yellow-500 text-yellow-500" />
            </span>
          </div>
        )}
        {contractor.years_experience > 0 && (
          <div className="flex flex-col items-center rounded-xl border bg-slate-50 p-6">
            <span className="text-sm font-medium text-slate-500">Years Exp.</span>
            <span className="text-2xl font-bold">{contractor.years_experience}+</span>
          </div>
        )}
        {contractor.hourly_rate != null && (
          <div className="flex flex-col items-center rounded-xl border bg-slate-50 p-6">
            <span className="text-sm font-medium text-slate-500">Hourly Rate</span>
            <span className="text-2xl font-bold">${Number(contractor.hourly_rate).toFixed(0)}</span>
          </div>
        )}
      </section>

      {/* Content + sidebar */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-8 lg:col-span-2">
          {/* About */}
          {contractor.bio && (
            <section>
              <h3 className="mb-4 text-xl font-bold">About</h3>
              <p className="leading-relaxed text-slate-600">{contractor.bio}</p>
            </section>
          )}

          {/* Verification details */}
          {(contractor.license_number || contractor.insurance_verified) && (
            <section>
              <h4 className="mb-4 flex items-center gap-2 font-bold">
                <ShieldCheck className="size-5 text-primary" /> Credentials
              </h4>
              <ul className="space-y-3">
                {contractor.license_number && (
                  <li className="flex items-center gap-3 text-sm">
                    <ShieldCheck className="size-5 text-primary" />
                    License: {contractor.license_number}
                  </li>
                )}
                {contractor.insurance_verified && (
                  <li className="flex items-center gap-3 text-sm">
                    <ShieldCheck className="size-5 text-primary" />
                    Insurance Verified
                  </li>
                )}
              </ul>
            </section>
          )}

          {/* Services based on categories */}
          {contractor.categories.length > 0 && (
            <section>
              <h3 className="mb-6 text-xl font-bold">Services</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {contractor.categories.map((cat) => (
                  <Card key={cat.slug}>
                    <CardContent className="p-5">
                      <h4 className="mb-2 font-semibold">{cat.name}</h4>
                      <p className="mb-3 text-sm text-slate-500">
                        Professional {cat.name.toLowerCase()} services in the Portland area.
                      </p>
                      {contractor.hourly_rate != null && (
                        <p className="mb-4 text-lg font-bold text-primary">
                          From ${Number(contractor.hourly_rate).toFixed(0)}/hr
                        </p>
                      )}
                      <Button className="w-full" size="sm">Request Quote</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Member info */}
          <section className="rounded-xl border bg-slate-50 p-6">
            <p className="text-sm text-slate-500">
              Member since {memberSince}
              {contractor.service_radius_miles > 0 && (
                <> &middot; Serves within {contractor.service_radius_miles} miles</>
              )}
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="sticky top-20">
            <Card id="quote-form" className="overflow-hidden border-l-[6px] border-l-primary shadow-xl">
              <CardContent className="p-0">
                <div className="border-b p-6">
                  <h4 className="text-xl font-bold">Get a Free Quote</h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Describe your project and get a response.
                  </p>
                </div>
                <form onSubmit={handleQuoteSubmit} className="space-y-4 p-6">
                  {quoteResult && (
                    <div
                      className={cn(
                        "flex items-start gap-2 rounded-lg p-3 text-sm",
                        quoteResult.ok
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      )}
                    >
                      {quoteResult.ok ? (
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                      ) : (
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      )}
                      {quoteResult.message}
                    </div>
                  )}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Describe Your Project *
                    </label>
                    <textarea
                      required
                      minLength={10}
                      maxLength={2000}
                      value={quoteDescription}
                      onChange={(e) => setQuoteDescription(e.target.value)}
                      className="w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-primary focus:ring-primary"
                      placeholder="What needs to be done?"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Timeline
                      </label>
                      <select
                        value={quoteTimeline}
                        onChange={(e) => setQuoteTimeline(e.target.value)}
                        className="w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-primary focus:ring-primary"
                      >
                        {TIMELINE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        ZIP Code *
                      </label>
                      <input
                        required
                        type="text"
                        pattern="\d{5}"
                        value={quoteZip}
                        onChange={(e) => setQuoteZip(e.target.value)}
                        placeholder="97201"
                        className="w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={quoteName}
                      onChange={(e) => setQuoteName(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={quoteEmail}
                      onChange={(e) => setQuoteEmail(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={quoteSubmitting}
                    className="w-full py-4 font-bold shadow-lg"
                  >
                    {quoteSubmitting ? (
                      <><Loader2 className="size-4 animate-spin" /> Sending...</>
                    ) : (
                      "Request Quote"
                    )}
                  </Button>
                  <p className="text-center text-[10px] text-slate-400">
                    No credit card required. Requesting a quote does not commit you to hire.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Trust badges */}
            {contractor.verification_tier !== "new" && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
                  <Shield className="size-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase">
                    {VERIFICATION_LABELS[contractor.verification_tier] || "Verified"}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
                  <Shield className="size-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase">HandyHub Protection</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
