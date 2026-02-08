"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingStore } from "@/stores/onboarding-store";
import {
  baseProfileSchema,
  type BaseProfileValues,
} from "@/lib/validations/onboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ProfileStepProps {
  isFinalStep: boolean;
  onComplete: () => void;
}

export function ProfileStep({ isFinalStep, onComplete }: ProfileStepProps) {
  const { formData, setFormData, nextStep, prevStep } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BaseProfileValues>({
    resolver: zodResolver(baseProfileSchema),
    defaultValues: {
      first_name: (formData.first_name as string) ?? "",
      last_name: (formData.last_name as string) ?? "",
      phone: (formData.phone as string) ?? "",
      zip_code: (formData.zip_code as string) ?? "",
    },
  });

  const onSubmit = (data: BaseProfileValues) => {
    setFormData(data);
    if (isFinalStep) {
      onComplete();
    } else {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Tell us about yourself
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          We&apos;ll use this to personalize your experience.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">
              First name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="first_name"
              placeholder="Jane"
              {...register("first_name")}
            />
            {errors.first_name && (
              <p className="text-sm text-red-500">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">
              Last name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="last_name"
              placeholder="Doe"
              {...register("last_name")}
            />
            {errors.last_name && (
              <p className="text-sm text-red-500">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zip_code">
            ZIP code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="zip_code"
            placeholder="90210"
            {...register("zip_code")}
          />
          {errors.zip_code && (
            <p className="text-sm text-red-500">{errors.zip_code.message}</p>
          )}
        </div>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit">
            {isFinalStep ? "Complete Setup" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
