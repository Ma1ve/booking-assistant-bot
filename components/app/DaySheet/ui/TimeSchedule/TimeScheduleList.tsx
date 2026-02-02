import { Dispatch, SetStateAction } from "react";

import { ItemGroup } from "@/components/ui/item";

import { ScheduleMode } from "../../types/ScheduleMode";
import { TimeScheduleItem } from "./TimeScheduleItem";

import { TUserForm } from "@/components/features/AddOrEditSchedule";

interface TimeScheduleListProps {
  date?: Date | null;
  scheduleList: TUserForm[];
  mode: ScheduleMode;
  setMode: Dispatch<SetStateAction<ScheduleMode>>;
  setActiveSchedule: Dispatch<SetStateAction<TUserForm | null>>;
}

export const TimeScheduleList = ({
  date,
  scheduleList,
  mode,
  setMode,
  setActiveSchedule,
}: TimeScheduleListProps) => {
  return (
    <div
      className="flex w-full max-w-md flex-col gap-6 max-h-[80vh] overflow-y-auto px-3 py-1"
      onClick={() => {
        setMode("");
      }}
    >
      <ItemGroup className="gap-7">
        {scheduleList.map((schedule) => (
          <TimeScheduleItem
            date={date}
            key={schedule.id}
            mode={mode}
            setActiveSchedule={setActiveSchedule}
            {...schedule}
          />
        ))}
      </ItemGroup>
    </div>
  );
};
