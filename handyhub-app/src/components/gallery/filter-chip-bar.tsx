"use client";

import { cn } from "@/lib/utils";

interface FilterOption {
  readonly value: string;
  readonly label: string;
}

interface FilterChipBarProps {
  readonly options: readonly FilterOption[];
  readonly selected: string;
  readonly onChange: (value: string) => void;
  readonly className?: string;
}

export function FilterChipBar({ options, selected, onChange, className }: FilterChipBarProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-1 scrollbar-hide", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            selected === option.value
              ? "bg-primary text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
