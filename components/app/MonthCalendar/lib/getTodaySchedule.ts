import { IDaySchedule } from "../types/IDaySchedule";

export function getTodaySchedule(days: IDaySchedule[]) {
  const today = new Date().getDate();

  return days.find((el) => el.date.getDate() === today) ?? null;
}
