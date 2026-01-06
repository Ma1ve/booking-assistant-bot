import { useMutation } from "@apollo/client/react";

import { GET_CLOSEST_SCHEDULE_TODAY } from "@/components/app/NearestEntryDay";
import { GET_USER_BY_DAY } from "@/components/app/DaySheet";
import { UPDATE_SCHEDULE } from "../graphql/updateSchedule";

export const useUpdateSchedule = (date: string) => {
  return useMutation(UPDATE_SCHEDULE, {
    refetchQueries: [
      { query: GET_CLOSEST_SCHEDULE_TODAY },
      { query: GET_USER_BY_DAY, variables: { date } },
    ],
    awaitRefetchQueries: true,
  });
};
