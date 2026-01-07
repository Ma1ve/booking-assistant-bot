import { DateTime } from "luxon";
import { TIME_ZONE } from "../consts/timeZone";

export function getFormatTime(date: Date): string {
  return DateTime.fromJSDate(date).setZone(TIME_ZONE).toLocaleString(DateTime.TIME_24_SIMPLE);
}
