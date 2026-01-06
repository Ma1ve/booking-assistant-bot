import { Dispatch, SetStateAction } from "react";

import { IDaySchedule } from "../types/IDaySchedule";
import { DayItem } from "./DayItem";

interface DayListProps {
  days: IDaySchedule[];
  onSelectDay: Dispatch<SetStateAction<IDaySchedule | null>>;
}

export const DayList = ({ days, onSelectDay }: DayListProps) => {
  const today = new Date().getDate();

  return (
    <div className="p-2.5 grid grid-cols-7 gap-3 gap-y-7 mt-20 border-2 border-green-900 rounded-[10px] overflow-visible">
      {days.map((day) => {
        return (
          <DayItem key={day.sheduleId} day={day} today={today} onClick={() => onSelectDay(day)} />
        );
      })}
    </div>
  );
};
