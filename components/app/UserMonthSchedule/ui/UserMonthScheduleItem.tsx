import { Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { UserScheduleItem } from "../types/userSchedules";

interface UserMonthScheduleItemProps {
  schedule: UserScheduleItem;
}

export const UserMonthScheduleItem = ({ schedule }: UserMonthScheduleItemProps) => {
  return (
    <Card className="py-5 relative w-full rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
      <CardContent className="relative text-white px-5 flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <span className="font-semibold tracking-tight uppercase opacity-90 bg-[#3d3d3d] rounded-lg px-3 py-1 text-sm">
            {schedule.date}
          </span>
        </div>

        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-white/70" />
            <span className="text-xl font-bold">
              {schedule.startTime} – {schedule.endTime}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 w-full pt-2 border-t border-white/10">
          <MapPin className="w-5 h-5 mt-1 shrink-0 text-white/70" />
          <span className="text-lg leading-tight opacity-90">{schedule.address}</span>
        </div>
      </CardContent>
    </Card>
  );
};
