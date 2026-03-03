export interface UserScheduleGQL {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  address: string;
  telegram: string | null;
}

export interface GetAllUserSchedulesQuery {
  getAllUserSchedules: UserScheduleGQL[];
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
