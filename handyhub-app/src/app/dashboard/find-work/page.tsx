import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function FindWorkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Find Work"
        description="Browse available projects in your area that match your skills."
      />
      <EmptyState
        icon={Briefcase}
        title="Project feed coming soon"
        description="Browse and bid on projects posted by homeowners in your service area."
      />
    </div>
  );
}
