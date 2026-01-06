import { gql } from "@apollo/client";

export const DELETE_SCHEDULE_BY_ID = gql`
  mutation deleteScheduleById($userId: Int!) {
    deleteScheduleById(userId: $userId) {
      firstName
      lastName
      telegram
      startTime
      endTime
      address
    }
  }
`;
