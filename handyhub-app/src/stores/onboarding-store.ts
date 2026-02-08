import { create } from "zustand";
import type { UserRole } from "@/types";

interface OnboardingState {
  currentStep: number;
  selectedRole: UserRole | null;
  formData: Record<string, unknown>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSelectedRole: (role: UserRole) => void;
  setFormData: (data: Record<string, unknown>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 0,
  selectedRole: null,
  formData: {},
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set({ currentStep: get().currentStep + 1 }),
  prevStep: () => set({ currentStep: Math.max(0, get().currentStep - 1) }),
  setSelectedRole: (role) => set({ selectedRole: role }),
  setFormData: (data) =>
    set({ formData: { ...get().formData, ...data } }),
  reset: () =>
    set({ currentStep: 0, selectedRole: null, formData: {} }),
}));
