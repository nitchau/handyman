import { ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProVerificationCta() {
  return (
    <Card className="border-emerald-200 bg-emerald-50">
      <CardContent className="flex flex-col items-center gap-4 py-6 text-center sm:flex-row sm:text-left">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <ShieldCheck className="size-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-emerald-800">
            Want a pro to verify this estimate?
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            Get a licensed contractor to review your AI-generated plan and
            confirm quantities, materials, and costs before you buy.
          </p>
        </div>
        <Button disabled className="shrink-0">
          Coming Soon
        </Button>
      </CardContent>
    </Card>
  );
}
