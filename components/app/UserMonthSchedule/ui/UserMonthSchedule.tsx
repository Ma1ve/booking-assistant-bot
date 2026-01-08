import { UserMonthScheduleList } from "./UserMonthScheduleList";

import { UserMonthScheduleError } from "./UserMonthScheduleError";
import { UserMonthScheduleLoader } from "./UserMonthScheduleLoader";
import { useUserSchedules } from "../hooks/useUserSchedules";
import { UserMonthScheduleEmpty } from "./UserMonthScheduleEmpry";

import Image from "next/image";

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

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://i.pinimg.com/736x/91/03/f4/9103f4440d01ed31d17957d38a9f4df3.jpg"
          alt="Background"
          fill
          priority
          className="object-cover brightness-50"
          sizes="100vw"
        />
      </div>

      {schedules.length === 0 ? (
        <div className="relative z-10 h-full overflow-y-auto mx-5">
          <UserMonthScheduleEmpty />
        </div>
      ) : (
        <div className="relative z-10 h-full overflow-y-auto">
          <UserMonthScheduleList userScheduleList={schedules} />
        </div>
      )}

      {/* <div className="relative z-10 h-full overflow-y-auto mx-5">
        {schedules.length === 0 ? (
          <UserMonthScheduleEmpty />
        ) : (
        
        )}
      </div> */}
    </div>
  );
};
