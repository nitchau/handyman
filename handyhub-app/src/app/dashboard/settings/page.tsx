import { Settings } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account, notifications, and preferences."
      />
      <EmptyState
        icon={Settings}
        title="Settings coming soon"
        description="You'll be able to update your profile, notification preferences, and account settings here."
      />
    </div>
  );
}
