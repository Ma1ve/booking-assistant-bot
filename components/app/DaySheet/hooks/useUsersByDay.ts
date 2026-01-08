import { useQuery } from "@apollo/client/react";

import { TUserForm } from "@/components/features/AddOrEditSchedule";

import { IDaySchedule } from "../../AdminMonthSchedule";

import { GET_USER_BY_DAY } from "../graphql/queries/getUserByDay";

interface UsersByDayResponse {
  usersByDay: TUserForm[];
}

interface UsersByDayProps {
  selectedDay: IDaySchedule | null;
}

export function useUsersByDay({ selectedDay }: UsersByDayProps) {
  const { data, loading, error } = useQuery<UsersByDayResponse>(GET_USER_BY_DAY, {
    variables: selectedDay ? { date: selectedDay.date.toISOString() } : undefined,
    skip: !selectedDay,
  });

  return {
    scheduleList: data?.usersByDay,
    loading,
    error,
  };
}
