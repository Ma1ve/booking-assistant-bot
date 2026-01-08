export interface DayScheduleUserGQL {
  daySchedule: {
    date: string;
  };
  user: {
    startTime: string;
    endTime: string;
    address: string;
    telegram: string | null;
  };
}

export interface GetAllUserSchedulesQuery {
  getAllUserSchedules: DayScheduleUserGQL[];
}

export interface GetAllUserSchedulesVariables {
  chatId: string;
}

export interface UserScheduleItem {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  address: string;
  telegram: string | null;
}
