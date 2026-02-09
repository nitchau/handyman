"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useUserStore } from "@/stores/user-store";
import { StepProgress } from "@/components/ui/step-progress";
import { RoleStep } from "@/components/onboarding/role-step";
import { ProfileStep } from "@/components/onboarding/profile-step";
import { ContractorStep } from "@/components/onboarding/contractor-step";
import { UserRole } from "@/types";

const BASE_STEPS = [{ label: "Role" }, { label: "Profile" }];
const CONTRACTOR_STEPS = [
  { label: "Role" },
  { label: "Profile" },
  { label: "Business" },
];

export function OnboardingWizard() {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const { currentStep, selectedRole, formData, reset } = useOnboardingStore();
  const setProfile = useUserStore((s) => s.setProfile);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isContractor = selectedRole === UserRole.CONTRACTOR;
  const steps = isContractor ? CONTRACTOR_STEPS : BASE_STEPS;
  const totalSteps = steps.length;

  const handleComplete = async () => {
    setSaving(true);
    setError(null);

    const payload = {
      role: selectedRole,
      email: clerkUser?.primaryEmailAddress?.emailAddress ?? "",
      ...formData,
    };

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save profile");
      }

      const { data: profile } = await res.json();

      // Sync to client-side store
      setProfile(profile);

      reset();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <StepProgress steps={steps} currentStep={currentStep} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {currentStep === 0 && <RoleStep />}

      {currentStep === 1 && (
        <ProfileStep
          isFinalStep={totalSteps === 2}
          onComplete={handleComplete}
          saving={saving}
        />
      )}

      {currentStep === 2 && isContractor && (
        <ContractorStep onComplete={handleComplete} saving={saving} />
      )}
    </div>
  );
}
