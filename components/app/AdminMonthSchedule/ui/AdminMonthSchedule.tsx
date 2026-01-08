import { useState } from "react";

import { NearesetEntryDay } from "@/components/app/NearestEntryDay";

import { MonthCalendar } from "./MonthCalendar";

import { IDaySchedule } from "../types/IDaySchedule";
import { getTodaySchedule } from "../lib/getTodaySchedule";

interface AdminMonthScheduleProps {
  days: IDaySchedule[];
}

export function AdminMonthSchedule({ days }: AdminMonthScheduleProps) {
  const [selectedDay, setSelectedDay] = useState<IDaySchedule | null>(null);

  const handleOpenTodaySchedule = () => {
    const currDay = getTodaySchedule(days);
    setSelectedDay(currDay);
  };

  return (
    <div className="flex justify-center h-full px-3.75">
      <div>
        <NearesetEntryDay handleOpenTodaySchedule={handleOpenTodaySchedule} />

        <MonthCalendar days={days} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      </div>
    </div>
  );
}
