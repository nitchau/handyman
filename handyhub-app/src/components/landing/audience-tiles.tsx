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
}: TileProps) {
  return (
    <Card
      className={`relative flex flex-col ${
        featured ? "border-primary border-2 shadow-md" : "shadow-sm"
      }`}
    >
      {featured && (
        <Badge className="absolute -top-3 right-4 bg-primary text-white">
          Most Popular
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
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-12 text-center text-2xl font-bold text-slate-900">
        Choose Your Path
      </h2>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Tile 1 — DIY */}
        <Tile
          featured
          icon={<Hammer className="size-7" />}
          title="I Want to Do It Myself"
          subtitle="AI plans your project, compares prices across stores, and finds tool rentals nearby"
          bullets={[
            {
              icon: <Camera className="size-4" />,
              text: "Upload photos → get an instant material list",
            },
            {
              icon: <DollarSign className="size-4" />,
              text: "AI finds the best price across Home Depot, Lowe's, Amazon & more",
            },
            {
              icon: <Wrench className="size-4" />,
              text: "Find tool rentals nearby from commercial sources",
            },
            {
              icon: <BookOpen className="size-4" />,
              text: "Get step-by-step AI guidance",
            },
          ]}
          ctaLabel="Start Planning"
          ctaHref="/plan"
          ctaVariant="default"
        />

        {/* Tile 2 — Homeowner hiring */}
        <Tile
          icon={<Home className="size-7" />}
          title="I Need a Contractor"
          subtitle="Verified pros you can trust. Payments protected by escrow."
          bullets={[
            {
              icon: <ShieldCheck className="size-4" />,
              text: "Contractors can earn Verified badges (ID + background check)",
            },
            {
              icon: <Banknote className="size-4" />,
              text: "Zero hidden fees",
            },
            {
              icon: <CheckCircle2 className="size-4" />,
              text: "Payments held in escrow",
            },
            {
              icon: <BarChart3 className="size-4" />,
              text: "Compare bids side-by-side",
            },
          ]}
          ctaLabel="Find a Pro"
          ctaHref="/contractors"
          ctaVariant="outline"
        />

        {/* Tile 3 — Contractor */}
        <Tile
          icon={<HardHat className="size-7" />}
          title="I'm a Professional"
          subtitle="Get real jobs. No lead fees. Get paid through secure escrow."
          bullets={[
            {
              icon: <Zap className="size-4" />,
              text: "Zero lead fees",
            },
            {
              icon: <ListChecks className="size-4" />,
              text: "Pre-scoped AI projects",
            },
            {
              icon: <Milestone className="size-4" />,
              text: "Milestone-based payments",
            },
            {
              icon: <DollarSign className="size-4" />,
              text: "Earn extra income verifying DIY material lists",
            },
          ]}
          ctaLabel="Join as a Pro"
          ctaHref="/for-contractors"
          ctaVariant="outline"
        />

        {/* Tile 4 — Interior Designer */}
        <Tile
          icon={<Palette className="size-7" />}
          title="I'm a Designer"
          subtitle="Sell your design inspiration and earn from your creative eye."
          bullets={[
            {
              icon: <Upload className="size-4" />,
              text: "Upload room designs and mood boards",
            },
            {
              icon: <DollarSign className="size-4" />,
              text: "Earn from design purchases and commissions",
            },
            {
              icon: <Star className="size-4" />,
              text: "Get featured in our curated gallery",
            },
            {
              icon: <TrendingUp className="size-4" />,
              text: "Build your brand and grow your audience",
            },
          ]}
          ctaLabel="Start Selling Designs"
          ctaHref="/dashboard/designer"
          ctaVariant="outline"
        />
      </div>
    </section>
  );
}
