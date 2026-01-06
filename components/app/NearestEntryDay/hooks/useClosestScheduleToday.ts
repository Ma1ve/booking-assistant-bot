import { useQuery } from "@apollo/client/react";

import { GET_CLOSEST_SCHEDULE_TODAY } from "../graphql/queries/getClosestScheduleToday";
import { TodayClosestScheduleResponse } from "../types/todayClosestSchedule";

export function useClosestScheduleToday() {
  const { data, loading, error, refetch } = useQuery<TodayClosestScheduleResponse>(
    GET_CLOSEST_SCHEDULE_TODAY,
    {
      pollInterval: 60000,
    }
  );

  return {
    schedule: data?.todayClosestSchedule ?? null,
    loading,
    error,
    refetch,
  };
}
