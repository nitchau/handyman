"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/language-context";

const FEATURED_PHOTOS = [
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
];

const DESIGNER_AVATARS = [
  "https://i.pravatar.cc/40?u=sarah",
  "https://i.pravatar.cc/40?u=mike",
  "https://i.pravatar.cc/40?u=studionook",
  "https://i.pravatar.cc/40?u=amy",
  "https://i.pravatar.cc/40?u=designer5",
];

export function InspirationBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (FEATURED_PHOTOS.length - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const visiblePhotos = FEATURED_PHOTOS.slice(activeIndex, activeIndex + 3);

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-emerald-50 p-6 sm:p-8 md:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left — Copy */}
          <div className="min-w-0">
            <h2 className="mb-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
              {t("inspiration.title")}
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-slate-600 sm:text-base md:max-w-lg">
              {t("inspiration.subtitle")}
            </p>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/designs">
                <Button size="lg" className="gap-2 px-6 font-bold shadow-lg shadow-primary/20">
                  {t("inspiration.explore")} <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/sign-up?role=designer">
                <Button variant="outline" size="lg" className="px-6 font-bold">
                  {t("inspiration.joinDesigner")}
                </Button>
              </Link>
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {DESIGNER_AVATARS.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500">
                {t("inspiration.trustedBy")}{" "}
                <span className="font-semibold text-slate-700">
                  {t("inspiration.designerCount")}
                </span>
              </p>
            </div>
          </div>

          {/* Right — Mini preview cards */}
          <div className="flex justify-center gap-2 sm:gap-3 lg:justify-end">
            {visiblePhotos.map((src, i) => (
              <div
                key={`${activeIndex}-${i}`}
                className={`overflow-hidden rounded-xl shadow-md transition-all duration-500 ${
                  i === 1
                    ? "w-28 sm:w-36 sm:scale-105 lg:w-44"
                    : "w-24 opacity-80 sm:w-28 lg:w-36"
                }`}
              >
                <Image
                  src={src}
                  alt="Featured design"
                  width={180}
                  height={240}
                  className="h-40 w-full object-cover sm:h-48 lg:h-56"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
