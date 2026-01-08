import { UserMonthScheduleItem } from "./UserMonthScheduleItem";
import { UserScheduleItem } from "../types/userSchedules";

interface UserMonthScheduleListProps {
  userScheduleList: UserScheduleItem[];
}

export const UserMonthScheduleList = ({ userScheduleList }: UserMonthScheduleListProps) => {
  return (
    <div className="w-full h-[100dvh] relative">
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10" />
      <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar firt:pt-10">
        <div className="text-white text-center z-10 mt-10 mb-3 font-bold text-lg bg-black">
          Ближайшие записи:
        </div>

        {userScheduleList.map((schedule) => (
          <div key={schedule.id} className="w-full shrink-0 first:pt-10 last:pb-10 px-5">
            <UserMonthScheduleItem schedule={schedule} />
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />
    </div>
  );
};
