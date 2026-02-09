"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MEDIA_CONSTRAINTS,
  bomDimensionsSchema,
  type BomDimensionsValues,
} from "@/lib/validations/bom";
import { useBomStore } from "@/stores/bom-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/lib/i18n/language-context";

export function MediaStep() {
  const { t } = useTranslation();
  const {
    mediaFiles,
    mediaPreviews,
    dimensions,
    addMedia,
    removeMedia,
    setDimensions,
    nextStep,
    prevStep,
  } = useBomStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showDimensions, setShowDimensions] = useState(!!dimensions);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit: handleDimSubmit,
    formState: { errors: dimErrors },
  } = useForm<BomDimensionsValues>({
    resolver: zodResolver(bomDimensionsSchema),
    defaultValues: {
      length_ft: dimensions?.length_ft ?? undefined,
      width_ft: dimensions?.width_ft ?? undefined,
      height_ft: dimensions?.height_ft ?? undefined,
    },
  });

  const validateAndAddFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files);
      const totalCount = mediaFiles.length + arr.length;

      if (totalCount > MEDIA_CONSTRAINTS.maxFiles) {
        setFileError(t("plan.media.maxPhotos").replace("{max}", String(MEDIA_CONSTRAINTS.maxFiles)));
        return;
      }

      const accepted: readonly string[] = MEDIA_CONSTRAINTS.acceptedTypes;
      const invalid = arr.filter(
        (f) =>
          !accepted.includes(f.type) ||
          f.size > MEDIA_CONSTRAINTS.maxSizeBytes
      );

      if (invalid.length > 0) {
        setFileError(t("plan.media.fileError"));
        return;
      }

      setFileError(null);
      addMedia(arr);
    },
    [mediaFiles.length, addMedia, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files.length > 0) {
        validateAndAddFiles(e.dataTransfer.files);
      }
    },
    [validateAndAddFiles]
  );

  const handleContinue = () => {
    if (mediaFiles.length < MEDIA_CONSTRAINTS.minFiles) {
      setFileError(t("plan.media.minPhotos"));
      return;
    }

    if (showDimensions) {
      handleDimSubmit((data) => {
        setDimensions(data);
        nextStep();
      })();
    } else {
      setDimensions(null);
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          {t("plan.media.title")}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {t("plan.media.subtitle")}
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed bg-white px-6 py-10 text-center transition-colors",
          dragActive
            ? "border-emerald-400 bg-emerald-50"
            : "border-slate-300 hover:border-slate-400"
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-100">
          <Upload className="size-6 text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">
            {t("plan.media.dropzone")}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {t("plan.media.formats")}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={MEDIA_CONSTRAINTS.acceptedTypes.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) validateAndAddFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {fileError && <p className="text-sm text-red-500">{fileError}</p>}

      {/* Thumbnail previews */}
      {mediaPreviews.length > 0 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {mediaPreviews.map((src, i) => (
            <div key={src} className="group relative aspect-square">
              <img
                src={src}
                alt={`Upload ${i + 1}`}
                className="size-full rounded-lg border border-slate-200 object-cover"
              />
              <button
                type="button"
                onClick={() => removeMedia(i)}
                className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
          {mediaFiles.length < MEDIA_CONSTRAINTS.maxFiles && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-500"
            >
              <ImagePlus className="size-6" />
            </button>
          )}
        </div>
      )}

      {/* Optional dimensions */}
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showDimensions}
            onChange={(e) => setShowDimensions(e.target.checked)}
            className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-slate-700">
            {t("plan.media.dimensions")}
          </span>
        </label>

        {showDimensions && (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length_ft">{t("plan.media.length")}</Label>
              <Input
                id="length_ft"
                type="number"
                step="0.1"
                placeholder="12"
                {...register("length_ft", { valueAsNumber: true })}
              />
              {dimErrors.length_ft && (
                <p className="text-sm text-red-500">
                  {dimErrors.length_ft.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="width_ft">{t("plan.media.width")}</Label>
              <Input
                id="width_ft"
                type="number"
                step="0.1"
                placeholder="10"
                {...register("width_ft", { valueAsNumber: true })}
              />
              {dimErrors.width_ft && (
                <p className="text-sm text-red-500">
                  {dimErrors.width_ft.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="height_ft">{t("plan.media.height")}</Label>
              <Input
                id="height_ft"
                type="number"
                step="0.1"
                placeholder="8"
                {...register("height_ft", { valueAsNumber: true })}
              />
              {dimErrors.height_ft && (
                <p className="text-sm text-red-500">
                  {dimErrors.height_ft.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={prevStep}>
          {t("plan.media.back")}
        </Button>
        <Button type="button" onClick={handleContinue} size="lg">
          {t("plan.media.analyze")}
        </Button>
      </div>
    </div>
  );
}
