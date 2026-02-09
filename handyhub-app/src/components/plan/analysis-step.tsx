"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { useBomStore } from "@/stores/bom-store";
import { AIAnalysisStatus } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/language-context";

export function AnalysisStep() {
  const { t } = useTranslation();

  const ANALYSIS_MESSAGES = [
    t("plan.analysis.msg1"),
    t("plan.analysis.msg2"),
    t("plan.analysis.msg3"),
    t("plan.analysis.msg4"),
    t("plan.analysis.msg5"),
  ];

  const {
    projectData,
    mediaFiles,
    dimensions,
    designReference,
    nextStep,
    setAnalysisStatus,
    setResult,
    error,
    setError,
  } = useBomStore();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const handleRetry = useCallback(() => {
    setError(null);
    setMessageIndex(0);
    setProgress(0);
    setRetryCount((c) => c + 1);
  }, [setError]);

  useEffect(() => {
    setAnalysisStatus(AIAnalysisStatus.ANALYZING);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    // Progress animation — holds at 90% until real response
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < ANALYSIS_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 90));
    }, 300);

    // Build FormData and call API
    const formData = new FormData();
    formData.append("projectData", JSON.stringify(projectData));
    if (dimensions) {
      formData.append("dimensions", JSON.stringify(dimensions));
    }
    for (const file of mediaFiles) {
      formData.append("images", file);
    }
    if (designReference) {
      formData.append(
        "designReference",
        JSON.stringify({
          designId: designReference.designId,
          designTitle: designReference.designTitle,
          designStyle: designReference.designStyle,
          budgetTier: designReference.budgetTier,
          estimatedCost: designReference.estimatedCost,
          designerId: designReference.designerId,
          productTags: designReference.productTags,
          referencePhotoUrls: designReference.mediaUrls,
        })
      );
    }

    fetch("/api/generate-bom", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Request failed (${res.status})`);
        }
        return data;
      })
      .then((result) => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
        setProgress(100);
        setResult(result);
        setAnalysisStatus(AIAnalysisStatus.COMPLETE);
        nextStep();
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        clearInterval(messageInterval);
        clearInterval(progressInterval);
        setAnalysisStatus(AIAnalysisStatus.ERROR);
        setError(err.message || "Something went wrong. Please try again.");
      });

    return () => {
      controller.abort();
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    retryCount,
    projectData,
    mediaFiles,
    dimensions,
    designReference,
    setAnalysisStatus,
    setResult,
    setError,
    nextStep,
  ]);

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            {t("plan.analysis.failedTitle")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {t("plan.analysis.failedSubtitle")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 py-8">
          <AlertCircle className="size-12 text-red-500" />

          <p className="max-w-md text-center text-sm text-red-600">{error}</p>

          <Button onClick={handleRetry} variant="outline" className="gap-2">
            <RotateCcw className="size-4" />
            {t("plan.analysis.tryAgain")}
          </Button>
        </div>
      </div>
    );
  }

  // Analyzing state
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          {t("plan.analysis.title")}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {t("plan.analysis.subtitle")}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 py-8">
        <Loader2 className="size-12 animate-spin text-emerald-500" />

        <Progress value={progress} className="mx-auto w-full max-w-sm" />

        <p className="text-sm font-medium text-slate-600">
          {ANALYSIS_MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  );
}
