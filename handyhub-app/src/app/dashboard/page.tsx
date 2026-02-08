import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your projects."
      />
      <EmptyState
        icon={LayoutDashboard}
        title="Your dashboard is empty"
        description="Start by planning your first project or browsing contractors in your area."
        actionLabel="Plan a Project"
        actionHref="/plan"
      />
    </div>
  );
}
