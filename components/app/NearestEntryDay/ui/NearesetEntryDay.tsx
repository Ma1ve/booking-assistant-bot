"use client";

import { Button } from "@/components/ui/button";

import { NearestEmptyEntry } from "./NearestEmptyEntry";
import { NearestEntry } from "./NearestEntry";

import { NearesetEntryDayLoader } from "./NearesetEntryDayLoader";

import { useClosestScheduleToday } from "../hooks/useClosestScheduleToday";
import { NearesetEntryDayError } from "./NearesetEntryDayError";

interface NearesetEntryDayProps {
  handleOpenTodaySchedule: () => void;
}

export function NearesetEntryDay({ handleOpenTodaySchedule }: NearesetEntryDayProps) {
  const { schedule, loading, error } = useClosestScheduleToday();

  if (loading) {
    return <NearesetEntryDayLoader />;
  }

  if (error) {
    <NearesetEntryDayError />;
  }

  const isScheduleNotExist = schedule === null;

  return (
    <div className="border-2 rounded-[10px] mt-10 border-[#27272a]">
      {isScheduleNotExist ? <NearestEmptyEntry /> : <NearestEntry {...schedule} />}

      <Button
        onClick={handleOpenTodaySchedule}
        className="cursor-pointer hover:bg-zinc-900 text-white rounded-t-none w-full backdrop-blur-md bg-zinc-800 border border-white/15 shadow-lg"
      >
        Приемы на сегодня
      </Button>
    </div>
  );
}
