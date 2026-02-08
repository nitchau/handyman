import { DesignerTier } from "@/types/database";
import { cn } from "@/lib/utils";

interface DesignerBadgeProps {
  readonly tier: DesignerTier;
  readonly size?: "sm" | "md";
  readonly className?: string;
}

const tierConfig: Record<DesignerTier, { label: string; icon: string; className: string }> = {
  [DesignerTier.COMMUNITY_CREATOR]: {
    label: "Creator",
    icon: "\uD83C\uDFA8",
    className: "bg-slate-100 text-slate-700",
  },
  [DesignerTier.VERIFIED_DESIGNER]: {
    label: "Verified",
    icon: "\uD83C\uDFA8\u2713",
    className: "bg-emerald-100 text-emerald-700",
  },
  [DesignerTier.FEATURED_DESIGNER]: {
    label: "Featured",
    icon: "\uD83C\uDFA8\u2B50",
    className: "bg-amber-100 text-amber-700 ring-1 ring-amber-300",
  },
};

export function DesignerBadge({ tier, size = "sm", className }: DesignerBadgeProps) {
  const config = tierConfig[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        config.className,
        className
      )}
    >
      {config.icon} {config.label}
    </span>
  );
}
