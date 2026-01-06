"use client";

import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

import { Badge } from "@/components/ui/badge";

import { ScheduleMode } from "../../types/ScheduleMode";

import { getInitials } from "@/components/shared/lib/getInitials";
import { getFullName } from "@/components/shared/lib/getFullName";

import { getIsLessEndTime } from "../../lib/getIsLessEndTime";
import { getIsAppointmentNow } from "../../lib/getIsAppointmentNow";
import { TUserForm } from "@/components/features/AddOrEditSchedule";

interface TimeScheduleItemProps extends TUserForm {
  date: Date | undefined;
  mode?: ScheduleMode;
  setActiveSchedule?: Dispatch<SetStateAction<TUserForm | null>>;
}

const badgeClassByMode: Record<string, string> = {
  delete: "bg-red-800 text-white p-[5px]",
  edit: "bg-white text-black p-[5px]",
  default: "bg-[#18181b] text-white px-[15px] py-[10px]",
};

export const TimeScheduleItem = ({
  date,
  id,
  firstName,
  lastName,
  address,
  startTime,
  endTime,
  telegram,
  mode = "",
  setActiveSchedule,
}: TimeScheduleItemProps) => {
  const handleDeleteSchedule = () => {
    console.log("Удалить");
    setActiveSchedule?.({
      id,
      firstName,
      lastName,
      address,
      startTime,
      endTime,
      telegram,
    });
  };

  const handleEditSchedule = () => {
    console.log("Редактировать");
    setActiveSchedule?.({
      id,
      firstName,
      lastName,
      address,
      startTime,
      endTime,
      telegram,
    });
  };

  const badgeTextByMode: Record<string, { title: string; handler: () => void }> = {
    delete: { title: "Удалить", handler: handleDeleteSchedule },
    edit: { title: "Редактировать", handler: handleEditSchedule },
  };

  const name = getFullName({ firstName, lastName });

  const isLessCurrEndTime = getIsLessEndTime({ date, endTime });
  const isAppointmentNow = getIsAppointmentNow({ date, startTime, endTime });

  const getBadgeText = () => {
    if (isLessCurrEndTime) return `${startTime} - ${endTime}`;

    return badgeTextByMode[mode]?.title ?? `${startTime} - ${endTime}`;
  };

  const classNameBadge = isLessCurrEndTime
    ? badgeClassByMode["default"]
    : badgeClassByMode[mode] ?? badgeClassByMode["default"];

  return (
    <Item
      key={id}
      variant="outline"
      asChild
      role="listitem"
      className={cn(
        "bg-black",
        isLessCurrEndTime && "filter contrast-50",
        isAppointmentNow && "ring-2 ring-green-900"
      )}
    >
      <div>
        <ItemMedia variant="image">
          <div className="w-10 h-10 flex items-center justify-center rounded text-zinc-100 text-md font-semibold select-none bg-orange-600">
            {getInitials(name)}
          </div>
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">{name}</ItemTitle>
          <ItemDescription>{address}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center right-6 -bottom-5">
          <ItemDescription>
            <Badge
              variant="outline"
              className={cn("w-30 text-sm transition-all", classNameBadge)}
              onClick={(e) => {
                e.stopPropagation();

                if (isLessCurrEndTime) return;

                badgeTextByMode[mode]?.handler();
              }}
            >
              {getBadgeText()}
            </Badge>
          </ItemDescription>
        </ItemContent>
      </div>
    </Item>
  );
};
