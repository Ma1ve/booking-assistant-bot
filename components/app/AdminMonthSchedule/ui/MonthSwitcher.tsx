"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthSwitcherProps {
  label: string;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const MonthSwitcher = ({
  label,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: MonthSwitcherProps) => {
  return (
    <div className="flex items-center justify-between mt-5 px-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        disabled={!canGoPrev}
        className="text-white hover:bg-zinc-800 disabled:opacity-30"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <span className="capitalize text-white font-medium text-base">{label}</span>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={!canGoNext}
        className="text-white hover:bg-zinc-800 disabled:opacity-30"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};
