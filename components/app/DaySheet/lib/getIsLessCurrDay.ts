import { TIME_ZONE } from "@/components/shared/consts/timeZone";
import { DateTime } from "luxon";

interface LessCurrDayArgs {
  currDate?: Date | null;
}

export const getIsLessCurrDay = ({ currDate }: LessCurrDayArgs) => {
  if (!currDate) return true;

  const today = DateTime.now().setZone(TIME_ZONE).startOf("day");
  const date = DateTime.fromJSDate(currDate).setZone(TIME_ZONE).startOf("day");

  return date < today;
};
