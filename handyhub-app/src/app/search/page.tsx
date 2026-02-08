import { Search } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <PageHeader
            title="Find a Contractor"
            description="Search verified contractors in your area by specialty, rating, and availability."
          />
          <EmptyState
            icon={Search}
            title="Contractor search coming soon"
            description="Browse and filter verified contractors by category, location, and ratings."
          />
        </div>
      </main>
    </>
  );
}
