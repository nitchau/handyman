import { Wrench } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <PageHeader
            title="Tool Rentals Nearby"
            description="Find tools available for rent at stores near you."
          />
          <EmptyState
            icon={Wrench}
            title="Tool rental search coming soon"
            description="Compare tool rental prices and availability across nearby stores with a map view."
          />
        </div>
      </main>
    </>
  );
}
