import { DateTime } from "luxon";
import { TIME_ZONE } from "@/components/shared/consts/timeZone";

interface DayFlagsArgs {
  date: Date;
}

export const getDayFlags = ({ date }: DayFlagsArgs) => {
  const now = DateTime.now().setZone(TIME_ZONE).startOf("day");
  const dayDate = DateTime.fromJSDate(date).setZone(TIME_ZONE).startOf("day");

  return {
    currDay: dayDate.day,
    isPast: dayDate < now,
    isToday: dayDate.hasSame(now, "day"),
    isWeekend: dayDate.weekday >= 6,
  };
};
