import { HardHat } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function ForContractorsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          For Contractors
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          Grow your business with verified leads and escrow-protected payments.
        </p>
      </div>
      <div className="mt-12">
        <EmptyState
          icon={HardHat}
          title="Contractor info page coming soon"
          description="Learn about verification tiers, lead generation, and how HandyHub helps you grow your business."
          actionLabel="Get Started Free"
          actionHref="/onboarding"
        />
      </div>
    </div>
  );
}
