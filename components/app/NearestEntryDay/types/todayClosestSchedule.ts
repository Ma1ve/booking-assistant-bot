import { TUserForm } from "@/components/features/AddOrEditSchedule";

export type TodayUserSchedule = TUserForm & {
  totalScheduleRecords: string;
  pastScheduleRecords: string;
};

export interface TodayClosestScheduleResponse {
  todayClosestSchedule: TodayUserSchedule | null;
}
