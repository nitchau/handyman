"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import { getIcon } from "@/lib/get-icon";
import {
  bomProjectSchema,
  type BomProjectValues,
} from "@/lib/validations/bom";
import { useBomStore } from "@/stores/bom-store";
import { SpaceType } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/language-context";

const CATEGORY_I18N_MAP: Record<string, string> = {
  plumbing: "plan.cat.plumbing",
  electrical: "plan.cat.electrical",
  painting: "plan.cat.painting",
  carpentry: "plan.cat.carpentry",
  roofing: "plan.cat.roofing",
  landscaping: "plan.cat.landscaping",
  hvac: "plan.cat.hvac",
  flooring: "plan.cat.flooring",
  "kitchen-remodel": "plan.cat.kitchenRemodel",
  "bathroom-remodel": "plan.cat.bathroomRemodel",
  "general-handyman": "plan.cat.generalHandyman",
  cleaning: "plan.cat.cleaning",
};

const SPACE_TYPES = Object.values(SpaceType).map((v) => ({
  value: v,
  label: v
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()),
}));

export function CategoryStep() {
  const { t } = useTranslation();
  const { projectData, setProjectData, nextStep } = useBomStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BomProjectValues>({
    resolver: zodResolver(bomProjectSchema),
    defaultValues: {
      category_slug: projectData.category_slug || "",
      space_type: (projectData.space_type as BomProjectValues["space_type"]) || undefined,
      description: projectData.description || "",
    },
  });

  const selectedCategory = watch("category_slug");

  const onSubmit = (data: BomProjectValues) => {
    setProjectData(data);
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          {t("plan.category.title")}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {t("plan.category.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category grid */}
        <div className="space-y-2">
          <Label>
            {t("plan.category.label")} <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const Icon = getIcon(cat.icon);
              const isSelected = selectedCategory === cat.slug;

              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() =>
                    setValue("category_slug", cat.slug, {
                      shouldValidate: true,
                    })
                  }
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 bg-white p-3 text-center transition-all hover:shadow-md",
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full",
                      isSelected
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">
                    {t(CATEGORY_I18N_MAP[cat.slug] ?? cat.slug)}
                  </span>
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register("category_slug")} />
          {errors.category_slug && (
            <p className="text-sm text-red-500">
              {errors.category_slug.message}
            </p>
          )}
        </div>

        {/* Space type */}
        <div className="space-y-2">
          <Label htmlFor="space_type">
            {t("plan.category.spaceType")} <span className="text-red-500">*</span>
          </Label>
          <select
            id="space_type"
            {...register("space_type")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">{t("plan.category.selectSpace")}</option>
            {SPACE_TYPES.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
          {errors.space_type && (
            <p className="text-sm text-red-500">
              {errors.space_type.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            {t("plan.category.description")} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            rows={4}
            placeholder={t("plan.category.placeholder")}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg">
            {t("plan.category.continue")}
          </Button>
        </div>
      </form>
    </div>
  );
}
