"use client";

import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/stores/onboarding-store";
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
  const { currentStep, selectedRole, formData, reset } = useOnboardingStore();

  const isContractor = selectedRole === UserRole.CONTRACTOR;
  const steps = isContractor ? CONTRACTOR_STEPS : BASE_STEPS;
  const totalSteps = steps.length;

  const handleComplete = () => {
    const submissionData = {
      role: selectedRole,
      ...formData,
    };

    // Phase 1: log to console. Phase 2 will persist to Supabase.
    console.log("[Onboarding] Submission:", submissionData);

    reset();
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <StepProgress steps={steps} currentStep={currentStep} />

      {currentStep === 0 && <RoleStep />}

      {currentStep === 1 && (
        <ProfileStep
          isFinalStep={totalSteps === 2}
          onComplete={handleComplete}
        />
      )}

      {currentStep === 2 && isContractor && (
        <ContractorStep onComplete={handleComplete} />
      )}
    </div>
  );
}
