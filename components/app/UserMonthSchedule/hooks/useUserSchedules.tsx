import { DateTime } from "luxon";
import { useQuery } from "@apollo/client/react";

import { GET_ALL_USER_SCHEDULES } from "../graphql/queries/getAllUserSchedules";

import {
  DayScheduleUserGQL,
  GetAllUserSchedulesQuery,
  GetAllUserSchedulesVariables,
  UserScheduleItem,
} from "../types/userSchedules";

export function useUserSchedules(chatId: string) {
  const { data, loading, error } = useQuery<GetAllUserSchedulesQuery, GetAllUserSchedulesVariables>(
    GET_ALL_USER_SCHEDULES,
    {
      variables: { chatId },
    }
  );

  const schedules: UserScheduleItem[] =
    data?.getAllUserSchedules?.map((item: DayScheduleUserGQL, index: number) => ({
      id: index + 1,
      date: DateTime.fromMillis(Number(item.daySchedule.date))
        .setZone("Europe/Moscow")
        .setLocale("ru")
        .toFormat("dd MMMM yyyy"),
      startTime: item.user.startTime,
      endTime: item.user.endTime,
      address: item.user.address,
      telegram: item.user.telegram ?? null,
    })) ?? [];

  return {
    schedules,
    loading,
    error,
  };
}
