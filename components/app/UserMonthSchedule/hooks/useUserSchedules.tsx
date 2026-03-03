import { DateTime } from "luxon";
import { useQuery } from "@apollo/client/react";

import { GET_ALL_USER_SCHEDULES } from "../graphql/queries/getAllUserSchedules";

import {
  GetAllUserSchedulesQuery,
  GetAllUserSchedulesVariables,
  UserScheduleGQL,
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
    data?.getAllUserSchedules?.map((item: UserScheduleGQL, index: number) => ({
      id: index + 1,
      date: DateTime.fromISO(item.date)
        .setZone("Europe/Moscow")
        .setLocale("ru")
        .toFormat("dd MMMM yyyy"),
      startTime: item.startTime,
      endTime: item.endTime,
      address: item.address,
      telegram: item.telegram ?? null,
    })) ?? [];

  return {
    schedules,
    loading,
    error,
  };
}
