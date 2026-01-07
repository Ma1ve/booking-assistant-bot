import { TIME_ZONE } from "@/components/shared/consts/timeZone";
import { DateTime } from "luxon";

export const getSheetTitle = (day: Date): string => {
  if (!day) return "";

  const dt = DateTime.fromJSDate(day).setZone(TIME_ZONE).setLocale("ru-RU");
  if (!dt.isValid) return "";

  const title = dt.toFormat("d MMMM | cccc");

  return title;
};
