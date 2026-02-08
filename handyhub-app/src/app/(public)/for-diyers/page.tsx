import { Hammer } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function ForDIYersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          For DIYers
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          Plan your project with AI, compare material prices, and rent tools nearby.
        </p>
      </div>
      <div className="mt-12">
        <EmptyState
          icon={Hammer}
          title="DIY info page coming soon"
          description="Learn how HandyHub's AI planner, price comparison, and tool rental features help you tackle any project."
          actionLabel="Start Planning"
          actionHref="/plan"
        />
      </div>
    </div>
  );
}
