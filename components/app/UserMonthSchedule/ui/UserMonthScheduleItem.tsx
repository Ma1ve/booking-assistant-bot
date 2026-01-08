import { User } from "@/lib/generated/prisma";

interface UserMonthScheduleItemProps {
  schedule: User;
}

export const UserMonthScheduleItem = ({ schedule }: UserMonthScheduleItemProps) => {
  return <div>{schedule.id}</div>;
};
