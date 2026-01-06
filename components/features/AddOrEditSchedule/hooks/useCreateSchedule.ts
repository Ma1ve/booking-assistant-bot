import { useMutation } from "@apollo/client/react";

import { GET_USER_BY_DAY } from "@/components/app/DaySheet";
import { GET_CLOSEST_SCHEDULE_TODAY } from "@/components/app/NearestEntryDay";
import { CREATE_SCHEDULE } from "../graphql/createSchedule";

import { CreateScheduleResponse } from "../types/createScheduleResponse";

export const useCreateSchedule = (date: string) => {
  return useMutation<CreateScheduleResponse>(CREATE_SCHEDULE, {
    refetchQueries: [
      { query: GET_CLOSEST_SCHEDULE_TODAY },
      { query: GET_USER_BY_DAY, variables: { date } },
    ],
    awaitRefetchQueries: true,
  });
};
