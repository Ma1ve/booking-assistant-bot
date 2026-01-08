import { User } from "@/lib/generated/prisma";

import { UserMonthScheduleItem } from "./UserMonthScheduleItem";

interface UserMonthScheduleListProps {
  userScheduleList: User[];
}

export const UserMonthScheduleList = ({ userScheduleList }: UserMonthScheduleListProps) => {
  return (
    <div className="p-2.5 grid grid-cols-7 gap-3 gap-y-7 mt-7 border-2 border-green-900 rounded-[10px] overflow-visible">
      {userScheduleList.map((schedule) => {
        return <UserMonthScheduleItem key={schedule.id} schedule={schedule} />;
      })}
    </div>
  );
};
