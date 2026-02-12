import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Plans"
        description="Project plans with materials lists and cost estimates, powered by Handy."
        actions={
          <Button asChild>
            <Link href="/plan">Create a Plan</Link>
          </Button>
        }
      />
      <EmptyState
        icon={ClipboardList}
        title="No plans yet"
        description="Upload photos of your space and let Handy generate a detailed project plan with materials and cost estimates."
        actionLabel="Create a Plan"
        actionHref="/plan"
      />
    </div>
  );
}
