import Link from "next/link";
import { Button } from "@/components/ui/button";

export function InspirationBanner() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary/5 p-8 md:p-16">
        <div className="relative z-10 max-w-lg">
          <h2 className="mb-6 text-3xl font-black leading-tight text-slate-900 md:text-5xl">
            Get Inspired for Your
            <br />
            Next Project
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-slate-600">
            Explore thousands of curated designs from our community. Find the
            aesthetic that fits your lifestyle and start planning with
            confidence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/designs">
              <Button size="lg" className="px-8 font-bold shadow-lg shadow-primary/20">
                Browse Gallery
              </Button>
            </Link>
            <Link href="/plan">
              <Button variant="outline" size="lg" className="px-8 font-bold">
                Start a Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
