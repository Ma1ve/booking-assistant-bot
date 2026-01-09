import { cn } from "@/lib/utils";
import Image from "next/image";

import { UserMonthScheduleList } from "./UserMonthScheduleList";

import { UserMonthScheduleError } from "./UserMonthScheduleError";
import { UserMonthScheduleLoader } from "./UserMonthScheduleLoader";
import { useUserSchedules } from "../hooks/useUserSchedules";
import { UserMonthScheduleEmpty } from "./UserMonthScheduleEmpry";

interface UserMonthScheduleProps {
  chatId: string;
}

export const UserMonthSchedule = ({ chatId }: UserMonthScheduleProps) => {
  const { schedules, loading, error } = useUserSchedules(chatId);

  if (loading) {
    return <UserMonthScheduleLoader />;
  }

  if (error) {
    return <UserMonthScheduleError />;
  }

  const isScheduleListEmpty = schedules.length === 0;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://i.pinimg.com/736x/f5/64/9b/f5649bc7e498880585e7bb7ac55cfb3f.jpg"
          alt="Background"
          fill
          priority
          className="object-cover brightness-50"
          sizes="100vw"
        />
      </div>

      <div className={cn("relative z-10 h-full overflow-y-auto")}>
        {!isScheduleListEmpty ? (
          <UserMonthScheduleEmpty />
        ) : (
          <UserMonthScheduleList userScheduleList={schedules} />
        )}
      </div>
    </div>
  );
};
