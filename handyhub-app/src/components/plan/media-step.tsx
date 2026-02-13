"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, ImagePlus, Info, Plus, Trash2, Upload, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/language-context";

export function MediaStep() {
  const { t } = useTranslation();
  const {
    mediaFiles,
    mediaPreviews,
    dimensions,
    designReference,
    roomDescription,
    dimensionMode,
    wallDimensions,
    inspirationFiles,
    inspirationPreviews,
    addMedia,
    removeMedia,
    setDimensions,
    setRoomDescription,
    setDimensionMode,
    addWall,
    removeWall,
    updateWall,
    addInspirationMedia,
    removeInspirationMedia,
    nextStep,
    prevStep,
  } = useBomStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const inspirationInputRef = useRef<HTMLInputElement>(null);
  const inspirationCameraRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [inspirationDragActive, setInspirationDragActive] = useState(false);
  const [showDimensions, setShowDimensions] = useState(!!dimensions);
  const [fileError, setFileError] = useState<string | null>(null);
  const [inspirationError, setInspirationError] = useState<string | null>(null);

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

  const validateAndAddInspiration = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files);
      const totalCount = inspirationFiles.length + arr.length;

      if (totalCount > MEDIA_CONSTRAINTS.maxInspirationFiles) {
        setInspirationError(
          t("plan.media.inspirationMaxPhotos").replace("{max}", String(MEDIA_CONSTRAINTS.maxInspirationFiles))
        );
        return;
      }

      const accepted: readonly string[] = MEDIA_CONSTRAINTS.acceptedTypes;
      const invalid = arr.filter(
        (f) =>
          !accepted.includes(f.type) ||
          f.size > MEDIA_CONSTRAINTS.maxSizeBytes
      );

      if (invalid.length > 0) {
        setInspirationError(t("plan.media.fileError"));
        return;
      }

      setInspirationError(null);
      addInspirationMedia(arr);
    },
    [inspirationFiles.length, addInspirationMedia, t]
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

  const handleInspirationDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setInspirationDragActive(false);
      if (e.dataTransfer.files.length > 0) {
        validateAndAddInspiration(e.dataTransfer.files);
      }
    },
    [validateAndAddInspiration]
  );

  const handleContinue = () => {
    const minRequired = designReference ? 0 : MEDIA_CONSTRAINTS.minFiles;
    if (mediaFiles.length < minRequired) {
      setFileError(t("plan.media.minPhotos"));
      return;
    }

    if (showDimensions && dimensionMode === "room") {
      handleDimSubmit((data) => {
        setDimensions(data);
        nextStep();
      })();
    } else {
      if (dimensionMode === "room") setDimensions(null);
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

      {designReference && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {t("plan.media.designRefHint")}
        </div>
      )}

      {/* Section A: Room Photos */}
      <div className="space-y-3">
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

        {/* Camera capture button */}
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="size-4" />
            {t("plan.media.takePhoto")}
          </Button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) validateAndAddFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Reference object tip */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
        <div className="flex gap-2">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-400" />
          <p className="text-xs text-blue-600">
            {t("plan.results.refObjectTip")}
          </p>
        </div>
      </div>

      {fileError && <p className="text-sm text-red-500">{fileError}</p>}

      {/* Thumbnail previews */}
      {mediaPreviews.length > 0 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {mediaPreviews.map((src, i) => (
            <div key={src} className="group relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
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

      {/* Section B: Design Inspiration Photos */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">
            {t("plan.media.inspirationTitle")}
          </h3>
          <p className="text-xs text-slate-500">
            {t("plan.media.inspirationSubtitle")}
          </p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setInspirationDragActive(true);
          }}
          onDragLeave={() => setInspirationDragActive(false)}
          onDrop={handleInspirationDrop}
          onClick={() => inspirationInputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed bg-white px-6 py-6 text-center transition-colors",
            inspirationDragActive
              ? "border-purple-400 bg-purple-50"
              : "border-slate-300 hover:border-slate-400"
          )}
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-purple-50">
            <ImagePlus className="size-5 text-purple-400" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            {t("plan.media.inspirationDropzone")}
          </p>
          <input
            ref={inspirationInputRef}
            type="file"
            accept={MEDIA_CONSTRAINTS.acceptedTypes.join(",")}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) validateAndAddInspiration(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => inspirationCameraRef.current?.click()}
          >
            <Camera className="size-4" />
            {t("plan.media.takePhoto")}
          </Button>
          <input
            ref={inspirationCameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) validateAndAddInspiration(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {inspirationError && (
          <p className="text-sm text-red-500">{inspirationError}</p>
        )}

        {inspirationPreviews.length > 0 && (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {inspirationPreviews.map((src, i) => (
              <div key={src} className="group relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Inspiration ${i + 1}`}
                  className="size-full rounded-lg border border-purple-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeInspirationMedia(i)}
                  className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
            {inspirationFiles.length < MEDIA_CONSTRAINTS.maxInspirationFiles && (
              <button
                type="button"
                onClick={() => inspirationInputRef.current?.click()}
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-purple-300 bg-white text-purple-400 transition-colors hover:border-purple-400 hover:text-purple-500"
              >
                <ImagePlus className="size-6" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Section C: Room Description */}
      <div className="space-y-2">
        <Label htmlFor="roomDescription">
          {t("plan.media.roomDescription")}
        </Label>
        <Textarea
          id="roomDescription"
          value={roomDescription}
          onChange={(e) => setRoomDescription(e.target.value)}
          placeholder={t("plan.media.roomDescriptionPlaceholder")}
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Section D: Dimensions */}
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
          <div className="space-y-4">
            {/* Dimension mode toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                {t("plan.media.dimensionMode")}:
              </span>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5">
                <button
                  type="button"
                  onClick={() => setDimensionMode("room")}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    dimensionMode === "room"
                      ? "bg-emerald-500 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {t("plan.media.wholeRoom")}
                </button>
                <button
                  type="button"
                  onClick={() => setDimensionMode("wall")}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    dimensionMode === "wall"
                      ? "bg-emerald-500 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {t("plan.media.wallByWall")}
                </button>
              </div>
            </div>

            {/* Whole room mode */}
            {dimensionMode === "room" && (
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

            {/* Wall-by-wall mode */}
            {dimensionMode === "wall" && (
              <div className="space-y-3">
                {wallDimensions.map((wall, i) => (
                  <div key={i} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">
                        {t("plan.media.wallName")}
                      </Label>
                      <Input
                        type="text"
                        placeholder={`Wall ${String.fromCharCode(65 + i)}`}
                        value={wall.name}
                        onChange={(e) =>
                          updateWall(i, { name: e.target.value })
                        }
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs">
                        {t("plan.media.wallWidth")}
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="10"
                        value={wall.width_ft || ""}
                        onChange={(e) =>
                          updateWall(i, {
                            width_ft: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs">
                        {t("plan.media.wallHeight")}
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="8"
                        value={wall.height_ft || ""}
                        onChange={(e) =>
                          updateWall(i, {
                            height_ft: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    {wallDimensions.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-red-500 hover:text-red-600"
                        onClick={() => removeWall(i)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {wallDimensions.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={addWall}
                  >
                    <Plus className="size-3" />
                    {t("plan.media.addWall")}
                  </Button>
                )}
              </div>
            )}
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
