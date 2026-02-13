"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  RotateCcw,
  Send,
  ArrowLeft,
  ArrowRight,
  SkipForward,
} from "lucide-react";
import { useBomStore } from "@/stores/bom-store";
import type { PreviewConversationTurn } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/language-context";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PreviewStep() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    projectData,
    mediaFiles,
    inspirationFiles,
    furniturePreferences,
    result,
    previewImage,
    previewDescription,
    previewHistory,
    previewStatus,
    previewError,
    setPreviewImage,
    setPreviewDescription,
    addPreviewTurn,
    setPreviewStatus,
    setPreviewError,
    setStep,
  } = useBomStore();

  const [feedback, setFeedback] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (userFeedback?: string) => {
      setPreviewStatus("generating");
      setPreviewError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // Build request body
        const body: Record<string, unknown> = {
          projectDescription: projectData.description,
          history: previewHistory,
          furniturePreferences,
        };

        if (previewHistory.length === 0) {
          // First call — include room photos and inspiration
          const photos = await Promise.all(
            mediaFiles.slice(0, 5).map(fileToDataUrl)
          );
          body.roomPhotos = photos;

          if (inspirationFiles.length > 0) {
            const inspirationDataUrls = await Promise.all(
              inspirationFiles.slice(0, 10).map(fileToDataUrl)
            );
            body.inspirationPhotos = inspirationDataUrls;
          }
        }

        if (userFeedback) {
          body.feedback = userFeedback;
        }

        const res = await fetch("/api/generate-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Request failed (${res.status})`);
        }

        // Record turns in history
        if (userFeedback) {
          addPreviewTurn({ role: "user", text: userFeedback });
        } else if (previewHistory.length === 0) {
          // Record the initial prompt turn
          addPreviewTurn({
            role: "user",
            text: `Generate a preview for: ${projectData.description}`,
          });
        }
        addPreviewTurn({
          role: "model",
          text: data.description,
          imageDataUrl: data.imageDataUrl,
        } as PreviewConversationTurn);

        setPreviewImage(data.imageDataUrl);
        setPreviewDescription(data.description);
        setPreviewStatus("complete");
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setPreviewStatus("error");
        setPreviewError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      }
    },
    [
      projectData.description,
      mediaFiles,
      inspirationFiles,
      furniturePreferences,
      previewHistory,
      addPreviewTurn,
      setPreviewImage,
      setPreviewDescription,
      setPreviewStatus,
      setPreviewError,
    ]
  );

  // Auto-generate on mount when idle
  const hasStarted = useRef(false);
  useEffect(() => {
    if (previewStatus === "idle" && !hasStarted.current) {
      hasStarted.current = true;
      generate();
    }
    // Don't abort on cleanup — React strict mode in dev double-mounts
    // components, and aborting here leaves the UI stuck in "generating"
  }, [previewStatus, generate]);

  const handleSendFeedback = () => {
    const trimmed = feedback.trim();
    if (!trimmed || previewStatus === "generating") return;
    setFeedback("");
    generate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendFeedback();
    }
  };

  const handleContinue = () => {
    if (result?.id) {
      router.push(`/dashboard/plans/${result.id}`);
    }
  };

  // Generating state
  if (previewStatus === "generating" || previewStatus === "idle") {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            {t("plan.preview.generatingTitle")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {t("plan.preview.generatingSubtitle")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 py-12">
          <Loader2 className="size-12 animate-spin text-emerald-500" />
          <p className="text-sm font-medium text-slate-600">
            {t("plan.preview.wait")}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (previewStatus === "error") {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            {t("plan.preview.failedTitle")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {t("plan.preview.failedSubtitle")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 py-8">
          <AlertCircle className="size-12 text-red-500" />

          <p className="max-w-md text-center text-sm text-red-600">
            {previewError}
          </p>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                setPreviewStatus("idle");
                hasStarted.current = false;
              }}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="size-4" />
              {t("plan.preview.tryAgain")}
            </Button>
            <Button onClick={handleContinue} variant="outline" className="gap-2">
              <SkipForward className="size-4" />
              {t("plan.preview.skipToPlan")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Complete state — show preview image with feedback
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          {t("plan.preview.title")}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {t("plan.preview.subtitle")}
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4">
          {previewImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={previewImage}
              alt="Handy-generated project preview"
              className="w-full max-w-2xl rounded-lg"
            />
          )}
          {previewDescription && (
            <p className="max-w-2xl text-center text-sm text-slate-600">
              {previewDescription}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mx-auto flex max-w-2xl gap-2">
        <Textarea
          placeholder={t("plan.preview.feedbackPlaceholder")}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-10 resize-none"
          rows={1}
        />
        <Button
          onClick={handleSendFeedback}
          disabled={!feedback.trim()}
          size="icon"
          className="shrink-0"
        >
          <Send className="size-4" />
        </Button>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(3)}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          {t("plan.preview.back")}
        </Button>
        <Button onClick={handleContinue} className="gap-2">
          {t("plan.preview.continueToPlan")}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
