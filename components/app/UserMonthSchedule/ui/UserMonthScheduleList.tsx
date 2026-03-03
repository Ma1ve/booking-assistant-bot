import { UserMonthScheduleItem } from "./UserMonthScheduleItem";
import { UserScheduleItem } from "../types/userSchedules";
import { Badge } from "@/components/ui/badge";
interface UserMonthScheduleListProps {
  userScheduleList: UserScheduleItem[];
}

export const UserMonthScheduleList = ({ userScheduleList }: UserMonthScheduleListProps) => {
  return (
    <div className="w-full relative">
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10" />
      <div className="flex flex-col gap-7 overflow-y-auto no-scrollbar firt:pt-10">
        <div className="flex justify-center">
          <Badge className="mt-5 mb-3 text-md">Ближайшие записи:</Badge>
        </div>

        {userScheduleList.map((schedule) => (
          <div key={schedule.id} className="w-full shrink-0 first:pt-10 last:pb-10 px-5">
            <UserMonthScheduleItem schedule={schedule} />
          </div>
        ))}
      </div>
    </div>
  );
};
