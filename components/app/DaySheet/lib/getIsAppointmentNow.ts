import { DateTime } from "luxon";
import { TIME_ZONE } from "@/components/shared/consts/timeZone";

interface AppointmentNowArgs {
  date: Date | undefined;
  startTime: string;
  endTime: string;
}

export const getIsAppointmentNow = ({ date, startTime, endTime }: AppointmentNowArgs) => {
  if (!date) return false;

  const now = DateTime.now().setZone(TIME_ZONE);
  const baseDate = DateTime.fromJSDate(date).setZone(TIME_ZONE);

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  const startInterval = baseDate.set({ hour: startH, minute: startM, second: 0, millisecond: 0 });
  const endInterval = baseDate.set({ hour: endH, minute: endM, second: 0, millisecond: 0 });

  return now >= startInterval && now <= endInterval;
};
