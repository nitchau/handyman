import { Home } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function ForHomeownersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          For Homeowners
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          Find trusted contractors, get AI-powered cost estimates, and manage your projects.
        </p>
      </div>
      <div className="mt-12">
        <EmptyState
          icon={Home}
          title="Homeowner info page coming soon"
          description="Discover how HandyHub helps you find verified contractors and manage home improvement projects."
          actionLabel="Get Started Free"
          actionHref="/onboarding"
        />
      </div>
    </div>
  );
}
