import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Post a Project"
        description="Describe your project and get matched with contractors or start a DIY plan."
      />
      <EmptyState
        icon={PlusCircle}
        title="Project posting form coming soon"
        description="You'll be able to describe your project, set a budget, upload photos, and get matched with qualified contractors."
      />
    </div>
  );
}
