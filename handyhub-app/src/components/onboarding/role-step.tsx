"use client";

import { Hammer, Home, HardHat, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES } from "@/lib/constants";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";

const ROLE_OPTIONS: { key: UserRole; icon: typeof Hammer }[] = [
  { key: "diy_user" as UserRole, icon: Hammer },
  { key: "homeowner" as UserRole, icon: Home },
  { key: "contractor" as UserRole, icon: HardHat },
  { key: "designer" as UserRole, icon: Palette },
];

export function RoleStep() {
  const { selectedRole, setSelectedRole, nextStep } = useOnboardingStore();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          How will you use HandyHub?
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Pick the option that best describes you. You can change this later.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {ROLE_OPTIONS.map(({ key, icon: Icon }) => {
          const role = ROLES[key as keyof typeof ROLES];
          const isSelected = selectedRole === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedRole(key)}
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border-2 bg-white p-6 text-center transition-all hover:shadow-md",
                isSelected
                  ? "border-emerald-500 bg-emerald-50 shadow-md"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-full",
                  isSelected
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                <Icon className="size-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{role.label}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {role.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={nextStep} disabled={!selectedRole} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
