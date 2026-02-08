import { FolderOpen } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Projects"
        description="Track and manage all your home improvement projects."
        actions={
          <Button asChild>
            <Link href="/dashboard/projects/new">New Project</Link>
          </Button>
        }
      />
      <EmptyState
        icon={FolderOpen}
        title="No projects yet"
        description="Create your first project to get started with planning, cost estimates, and contractor matching."
        actionLabel="Create Project"
        actionHref="/dashboard/projects/new"
      />
    </div>
  );
}
