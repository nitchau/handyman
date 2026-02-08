import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
          <span className="text-xs font-bold uppercase tracking-widest">
            New: AI Design Assistant
          </span>
        </div>
        <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-7xl">
          Every Home Project{" "}
          <br />
          <span className="text-primary">Starts Here</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
          Simplifying home improvement from design to build with expert
          guidance, quality resources, and verified local professionals.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/plan">
            <Button size="lg" className="px-10 py-4 text-lg font-bold shadow-xl shadow-primary/30">
              Start Your Project
            </Button>
          </Link>
          <Link href="/designs">
            <Button
              variant="outline"
              size="lg"
              className="px-10 py-4 text-lg font-bold"
            >
              View Inspiration
            </Button>
          </Link>
        </div>
      </div>
      {/* Abstract background shape */}
      <div className="absolute -right-40 -top-40 -z-0 opacity-10">
        <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="400" fill="url(#heroGrad)" />
          <defs>
            <radialGradient id="heroGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 400) rotate(90) scale(400)">
              <stop stopColor="#059669" />
              <stop offset="1" stopColor="#059669" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
