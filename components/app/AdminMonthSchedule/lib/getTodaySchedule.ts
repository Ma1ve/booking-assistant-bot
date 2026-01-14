import { DateTime } from "luxon";
import { TIME_ZONE } from "@/components/shared/consts/timeZone";

import { IDaySchedule } from "../types/IDaySchedule";

export function getTodaySchedule(days: IDaySchedule[]) {
  const today = DateTime.now().setZone(TIME_ZONE);

  return (
    days.find((el) =>
      DateTime.fromJSDate(el.date as Date)
        .setZone(TIME_ZONE)
        .hasSame(today, "day")
    ) ?? null
  );
}
