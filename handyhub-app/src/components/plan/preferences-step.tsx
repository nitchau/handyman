"use client";

import { useBomStore } from "@/stores/bom-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/language-context";

const KITCHEN_SPACE_TYPES = ["kitchen", "dining_room"];

export function PreferencesStep() {
  const { t } = useTranslation();
  const {
    projectData,
    furniturePreferences,
    setFurniturePreferences,
    nextStep,
    prevStep,
  } = useBomStore();

  const showKitchenOption = KITCHEN_SPACE_TYPES.includes(
    projectData.space_type
  );

  const toggle = (key: "keepFurniture" | "keepKitchenItems" | "keepDecor") => {
    setFurniturePreferences({
      ...furniturePreferences,
      [key]: !furniturePreferences[key],
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          {t("plan.preferences.title")}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {t("plan.preferences.subtitle")}
        </p>
      </div>

      <div className="mx-auto max-w-lg space-y-4">
        {/* Keep furniture */}
        <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-slate-50">
          <input
            type="checkbox"
            checked={furniturePreferences.keepFurniture}
            onChange={() => toggle("keepFurniture")}
            className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm font-medium text-slate-700">
            {t("plan.preferences.keepFurniture")}
          </span>
        </label>

        {/* Keep kitchen items — conditional */}
        {showKitchenOption && (
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-slate-50">
            <input
              type="checkbox"
              checked={furniturePreferences.keepKitchenItems}
              onChange={() => toggle("keepKitchenItems")}
              className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700">
              {t("plan.preferences.keepKitchen")}
            </span>
          </label>
        )}

        {/* Keep decor */}
        <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-slate-50">
          <input
            type="checkbox"
            checked={furniturePreferences.keepDecor}
            onChange={() => toggle("keepDecor")}
            className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm font-medium text-slate-700">
            {t("plan.preferences.keepDecor")}
          </span>
        </label>

        {/* Notes */}
        <div className="space-y-2 pt-2">
          <Label htmlFor="preferenceNotes">
            {t("plan.preferences.notes")}
          </Label>
          <Textarea
            id="preferenceNotes"
            value={furniturePreferences.notes}
            onChange={(e) =>
              setFurniturePreferences({
                ...furniturePreferences,
                notes: e.target.value,
              })
            }
            placeholder={t("plan.preferences.notesPlaceholder")}
            rows={3}
            className="resize-none"
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={prevStep}>
          {t("plan.preferences.back")}
        </Button>
        <Button type="button" onClick={nextStep} size="lg">
          {t("plan.preferences.continue")}
        </Button>
      </div>
    </div>
  );
}
