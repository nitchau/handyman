"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useBomStore } from "@/stores/bom-store";
import { getMockBomResult } from "@/lib/mock/bom-results";
import { AIAnalysisStatus } from "@/types";
import { Progress } from "@/components/ui/progress";

const ANALYSIS_MESSAGES = [
  "Uploading your photos...",
  "Analyzing room dimensions...",
  "Identifying materials needed...",
  "Comparing prices across retailers...",
  "Generating your project plan...",
];

export function AnalysisStep() {
  const router = useRouter();
  const { projectData, setAnalysisStatus, setResult } = useBomStore();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setAnalysisStatus(AIAnalysisStatus.ANALYZING);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < ANALYSIS_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 95));
    }, 80);

    const completeTimeout = setTimeout(() => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      setProgress(100);

      const result = getMockBomResult({
        category_slug: projectData.category_slug,
        description: projectData.description,
      });

      setResult(result);
      setAnalysisStatus(AIAnalysisStatus.COMPLETE);
      router.push(`/dashboard/plans/${result.id}`);
    }, 4000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [projectData, setAnalysisStatus, setResult, router]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Analyzing your space
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Our AI is reviewing your photos and generating a detailed project
          plan.
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
