"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { CATEGORIES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const contractorDetailsSchema = z.object({
  business_name: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Business name must be 100 characters or less"),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  years_experience: z
    .number({ error: "Years of experience is required" })
    .min(0, "Must be 0 or more")
    .max(60, "Must be 60 or less"),
  hourly_rate: z
    .number()
    .min(1, "Rate must be at least $1")
    .max(500, "Rate must be $500 or less")
    .optional()
    .or(z.nan().transform(() => undefined)),
  service_radius_miles: z
    .number({ error: "Service radius is required" })
    .min(1, "Radius must be at least 1 mile")
    .max(100, "Radius must be 100 miles or less"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
});

type ContractorDetailsValues = z.infer<typeof contractorDetailsSchema>;

interface ContractorStepProps {
  onComplete: () => void;
}

export function ContractorStep({ onComplete }: ContractorStepProps) {
  const { formData, setFormData, prevStep } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContractorDetailsValues>({
    resolver: zodResolver(contractorDetailsSchema),
    defaultValues: {
      business_name: (formData.business_name as string) ?? "",
      bio: (formData.bio as string) ?? "",
      years_experience: (formData.years_experience as number) ?? undefined,
      hourly_rate: (formData.hourly_rate as number) ?? undefined,
      service_radius_miles:
        (formData.service_radius_miles as number) ?? undefined,
      categories: (formData.categories as string[]) ?? [],
    },
  });

  const selectedCategories = watch("categories");

  const toggleCategory = (slug: string) => {
    const current = selectedCategories ?? [];
    const updated = current.includes(slug)
      ? current.filter((c) => c !== slug)
      : [...current, slug];
    setValue("categories", updated, { shouldValidate: true });
  };

  const onSubmit = (data: ContractorDetailsValues) => {
    setFormData(data);
    onComplete();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Business details
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Help homeowners find and trust your services.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="business_name">
            Business name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="business_name"
            placeholder="Acme Plumbing LLC"
            {...register("business_name")}
          />
          {errors.business_name && (
            <p className="text-sm text-red-500">
              {errors.business_name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio (optional)</Label>
          <Textarea
            id="bio"
            placeholder="Tell homeowners about your experience and specialties..."
            {...register("bio")}
          />
          {errors.bio && (
            <p className="text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="years_experience">
              Years of experience <span className="text-red-500">*</span>
            </Label>
            <Input
              id="years_experience"
              type="number"
              min={0}
              max={60}
              placeholder="5"
              {...register("years_experience", { valueAsNumber: true })}
            />
            {errors.years_experience && (
              <p className="text-sm text-red-500">
                {errors.years_experience.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourly_rate">Hourly rate ($)</Label>
            <Input
              id="hourly_rate"
              type="number"
              min={1}
              max={500}
              placeholder="75"
              {...register("hourly_rate", { valueAsNumber: true })}
            />
            {errors.hourly_rate && (
              <p className="text-sm text-red-500">
                {errors.hourly_rate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_radius_miles">
              Service radius (mi) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="service_radius_miles"
              type="number"
              min={1}
              max={100}
              placeholder="25"
              {...register("service_radius_miles", { valueAsNumber: true })}
            />
            {errors.service_radius_miles && (
              <p className="text-sm text-red-500">
                {errors.service_radius_miles.message}
              </p>
            )}
          </div>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-slate-700">
            Service categories <span className="text-red-500">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const isChecked = selectedCategories?.includes(cat.slug);
              return (
                <label
                  key={cat.slug}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                    isChecked
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.slug)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border",
                      isChecked
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300"
                    )}
                  >
                    {isChecked && (
                      <svg
                        className="size-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  {cat.name}
                </label>
              );
            })}
          </div>
          {errors.categories && (
            <p className="text-sm text-red-500">{errors.categories.message}</p>
          )}
        </fieldset>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit">Complete Setup</Button>
        </div>
      </form>
    </div>
  );
}
