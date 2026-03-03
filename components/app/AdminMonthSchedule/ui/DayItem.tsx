import { cn } from "@/lib/utils";

import { getDayClasses } from "../lib/getDayClasses";
import { getDayFlags } from "../lib/getDayFlags";
import { IDaySchedule } from "../types/IDaySchedule";

interface DayItemProps {
  day: IDaySchedule;
  zIndex: number;
  onClick: () => void;
}

export const DayItem = ({ day, zIndex, onClick }: DayItemProps) => {
  const { currDay, isToday, isPast, isWeekend } = getDayFlags({ date: day.date });

  return (
    <div
      onClick={onClick}
      style={{ zIndex }}
      className={cn(
        `relative w-full aspect-square rounded flex items-center justify-center text-white cursor-pointer backdrop-blur-md border border-white/15 shadow-lg`,
        getDayClasses({ isToday, isWeekend, isPast })
      )}
    >
      {currDay}
      {day.userCount > 0 && (
        <span
          className={cn(
            "absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-10 w-5 h-5 bg-green-900 text-white text-xs flex items-center justify-center rounded-full",
            isToday && "border border-white",
            isPast && "filter contrast-50"
          )}
        >
          {day.userCount}
        </span>
      )}
    </div>
  );
};
