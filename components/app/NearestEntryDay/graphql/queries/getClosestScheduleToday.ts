import { gql } from "@apollo/client";

export const GET_CLOSEST_SCHEDULE_TODAY = gql`
  query {
    todayClosestSchedule {
      id
      firstName
      lastName
      address
      startTime
      endTime
      telegram
      totalScheduleRecords
      pastScheduleRecords
    }
  }
`;
