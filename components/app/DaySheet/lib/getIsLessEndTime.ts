import { DateTime } from "luxon";
import { TIME_ZONE } from "@/components/shared/consts/timeZone";

interface LessEndTimeArgs {
  date: Date | undefined | null;
  endTime: string;
}

export const getIsLessEndTime = ({ date, endTime }: LessEndTimeArgs) => {
  if (!date) return false;

  const [endH, endM] = endTime.split(":").map(Number);

  const now = DateTime.now().setZone(TIME_ZONE);
  const baseDate = DateTime.fromJSDate(date).setZone(TIME_ZONE);

  const endInterval = baseDate.startOf("day").set({
    hour: endH,
    minute: endM,
  });

  return now > endInterval;
};
