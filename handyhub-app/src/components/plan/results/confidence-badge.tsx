import { cn } from "@/lib/utils";
import { ConfidenceTier } from "@/types";
import { Badge } from "@/components/ui/badge";

const TIER_CONFIG: Record<
  ConfidenceTier,
  { label: string; className: string }
> = {
  [ConfidenceTier.AI_ESTIMATE]: {
    label: "Handy Estimate",
    className: "border-amber-300 bg-amber-50 text-amber-700",
  },
  [ConfidenceTier.PRO_VERIFIED]: {
    label: "Pro Verified",
    className: "border-blue-300 bg-blue-50 text-blue-700",
  },
  [ConfidenceTier.COMMUNITY_VALIDATED]: {
    label: "Community Validated",
    className: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
};

interface ConfidenceBadgeProps {
  tier: ConfidenceTier;
  score?: number;
  className?: string;
}

export function ConfidenceBadge({
  tier,
  score,
  className,
}: ConfidenceBadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
      {score !== undefined && ` · ${score}%`}
    </Badge>
  );
}
