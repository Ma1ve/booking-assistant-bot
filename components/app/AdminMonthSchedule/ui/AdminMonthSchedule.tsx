"use client";

import { useState } from "react";

import { NearesetEntryDay } from "@/components/app/NearestEntryDay";

import { MonthCalendar } from "./MonthCalendar";
import { MonthSwitcher } from "./MonthSwitcher";

import { IDaySchedule, MonthData } from "../types/IDaySchedule";
import { getTodaySchedule } from "../lib/getTodaySchedule";

interface AdminMonthScheduleProps {
  months: MonthData[];
}

export function AdminMonthSchedule({ months }: AdminMonthScheduleProps) {
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<IDaySchedule | null>(null);

  const currentMonth = months[monthIndex];

  const handleOpenTodaySchedule = () => {
    const currDay = getTodaySchedule(months[0].days);
    setSelectedDay(currDay);
    setMonthIndex(0);
  };

  return (
    <div className="flex justify-center h-full px-3.75">
      <div className="w-full">
        <NearesetEntryDay handleOpenTodaySchedule={handleOpenTodaySchedule} />

        <MonthSwitcher
          label={currentMonth.label}
          canGoPrev={monthIndex > 0}
          canGoNext={monthIndex < months.length - 1}
          onPrev={() => setMonthIndex((i) => i - 1)}
          onNext={() => setMonthIndex((i) => i + 1)}
        />

        <MonthCalendar
          days={currentMonth.days}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      </div>
    </div>
  );
}
