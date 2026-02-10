"use client";

import {
  Hammer,
  Home,
  HardHat,
  Palette,
  Camera,
  DollarSign,
  Wrench,
  BookOpen,
  ShieldCheck,
  Banknote,
  BarChart3,
  Zap,
  ListChecks,
  Milestone,
  CheckCircle2,
  Upload,
  TrendingUp,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/language-context";

interface BulletItem {
  icon: React.ReactNode;
  text: string;
}

interface TileProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bullets: BulletItem[];
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "default" | "outline";
  featured?: boolean;
  featuredLabel?: string;
}

function Tile({
  icon,
  title,
  subtitle,
  bullets,
  ctaLabel,
  ctaHref,
  ctaVariant,
  featured,
  featuredLabel,
}: TileProps) {
  return (
    <Card
      className={`relative flex flex-col ${
        featured ? "border-primary border-2 shadow-md" : "shadow-sm"
      }`}
    >
      {featured && (
        <Badge className="absolute -top-3 right-4 bg-primary text-white">
          {featuredLabel}
        </Badge>
      )}
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-14 items-center justify-center rounded-xl bg-emerald-50 text-primary">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className="mt-0.5 shrink-0 text-primary">{b.icon}</span>
              {b.text}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link href={ctaHref} className="w-full">
          <Button variant={ctaVariant} className="w-full" size="lg">
            {ctaLabel}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export function AudienceTiles() {
  const { t } = useTranslation();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
        {t("audience.heading")}
      </h2>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Tile 1 — DIY */}
        <Tile
          featured
          featuredLabel={t("audience.mostPopular")}
          icon={<Hammer className="size-7" />}
          title={t("audience.diy.title")}
          subtitle={t("audience.diy.subtitle")}
          bullets={[
            {
              icon: <Camera className="size-4" />,
              text: t("audience.diy.bullet1"),
            },
            {
              icon: <DollarSign className="size-4" />,
              text: t("audience.diy.bullet2"),
            },
            {
              icon: <Wrench className="size-4" />,
              text: t("audience.diy.bullet3"),
            },
            {
              icon: <BookOpen className="size-4" />,
              text: t("audience.diy.bullet4"),
            },
          ]}
          ctaLabel={t("audience.diy.cta")}
          ctaHref="/plan"
          ctaVariant="default"
        />

        {/* Tile 2 — Homeowner hiring */}
        <Tile
          icon={<Home className="size-7" />}
          title={t("audience.homeowner.title")}
          subtitle={t("audience.homeowner.subtitle")}
          bullets={[
            {
              icon: <ShieldCheck className="size-4" />,
              text: t("audience.homeowner.bullet1"),
            },
            {
              icon: <Banknote className="size-4" />,
              text: t("audience.homeowner.bullet2"),
            },
            {
              icon: <CheckCircle2 className="size-4" />,
              text: t("audience.homeowner.bullet3"),
            },
            {
              icon: <BarChart3 className="size-4" />,
              text: t("audience.homeowner.bullet4"),
            },
          ]}
          ctaLabel={t("audience.homeowner.cta")}
          ctaHref="/contractors"
          ctaVariant="outline"
        />

        {/* Tile 3 — Contractor */}
        <Tile
          icon={<HardHat className="size-7" />}
          title={t("audience.contractor.title")}
          subtitle={t("audience.contractor.subtitle")}
          bullets={[
            {
              icon: <Zap className="size-4" />,
              text: t("audience.contractor.bullet1"),
            },
            {
              icon: <ListChecks className="size-4" />,
              text: t("audience.contractor.bullet2"),
            },
            {
              icon: <Milestone className="size-4" />,
              text: t("audience.contractor.bullet3"),
            },
            {
              icon: <DollarSign className="size-4" />,
              text: t("audience.contractor.bullet4"),
            },
          ]}
          ctaLabel={t("audience.contractor.cta")}
          ctaHref="/for-contractors"
          ctaVariant="outline"
        />

        {/* Tile 4 — Interior Designer */}
        <Tile
          icon={<Palette className="size-7" />}
          title={t("audience.designer.title")}
          subtitle={t("audience.designer.subtitle")}
          bullets={[
            {
              icon: <Upload className="size-4" />,
              text: t("audience.designer.bullet1"),
            },
            {
              icon: <DollarSign className="size-4" />,
              text: t("audience.designer.bullet2"),
            },
            {
              icon: <Star className="size-4" />,
              text: t("audience.designer.bullet3"),
            },
            {
              icon: <TrendingUp className="size-4" />,
              text: t("audience.designer.bullet4"),
            },
          ]}
          ctaLabel={t("audience.designer.cta")}
          ctaHref="/dashboard/designer"
          ctaVariant="outline"
        />
      </div>
    </section>
  );
}
