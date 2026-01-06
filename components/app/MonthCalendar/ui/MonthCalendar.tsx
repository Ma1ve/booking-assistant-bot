"use client";

import { Dispatch, SetStateAction, useCallback } from "react";

import { DaySheetModal } from "../../DaySheet/ui/DaySheetModal/DaySheetModal";

import { IDaySchedule } from "../types/IDaySchedule";
import { DayList } from "./DayList";

interface MonthCalendarProps {
  days: IDaySchedule[];
  selectedDay: IDaySchedule | null;
  setSelectedDay: Dispatch<SetStateAction<IDaySchedule | null>>;
}

export const MonthCalendar = ({ days, selectedDay, setSelectedDay }: MonthCalendarProps) => {
  return (
    <>
      <DayList days={days} onSelectDay={setSelectedDay} />

      <DaySheetModal selectedDay={selectedDay} onClose={() => setSelectedDay(null)} />
    </>
  );
};
