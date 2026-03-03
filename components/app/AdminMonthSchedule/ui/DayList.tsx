import { Dispatch, SetStateAction } from "react";

import { IDaySchedule } from "../types/IDaySchedule";
import { DayItem } from "./DayItem";

interface DayListProps {
  days: IDaySchedule[];
  onSelectDay: Dispatch<SetStateAction<IDaySchedule | null>>;
}

export const DayList = ({ days, onSelectDay }: DayListProps) => {
  const handleClick = (day: IDaySchedule) => {
    if (day.date === null) return;
    onSelectDay(day);
  };

  return (
    <div className="p-2.5 grid grid-cols-7 gap-x-2 gap-y-4 mt-5 border-2 border-green-900 rounded-[10px] overflow-visible">
      {days.map((day, idx) => (
        <DayItem
          key={day.date ? day.date.toISOString() : `placeholder-${idx}`}
          day={day}
          zIndex={days.length - idx}
          onClick={() => handleClick(day)}
        />
      ))}
    </div>
  );
};
