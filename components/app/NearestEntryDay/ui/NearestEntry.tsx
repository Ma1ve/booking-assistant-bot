import { DateTime } from "luxon";
import { TIME_ZONE } from "@/components/shared/consts/timeZone";

import { TimeScheduleItem } from "../../DaySheet";
import { TodayUserSchedule } from "../types/todayClosestSchedule";

export const NearestEntry = (props: TodayUserSchedule) => {
  const {
    id,
    firstName,
    lastName,
    address,
    startTime,
    endTime,
    telegram,
    totalScheduleRecords,
    pastScheduleRecords,
  } = props;

  const currDate = DateTime.now().setZone(TIME_ZONE).toJSDate();

  return (
    <>
      <div className="font-medium my-2.5 text-lg flex justify-center items-center h-[43px]">
        Ближайшая запись:
      </div>

      <TimeScheduleItem
        date={currDate}
        id={id}
        firstName={firstName}
        lastName={lastName}
        address={address}
        startTime={startTime}
        endTime={endTime}
        telegram={telegram}
      />

      <div className="my-2.5 flex justify-evenly">
        <div>Всего: {totalScheduleRecords}</div>
        <div>|</div>
        <div>Проведено: {pastScheduleRecords}</div>
      </div>
    </>
  );
};
