import { gql } from "@apollo/client";

export const UPDATE_SCHEDULE = gql`
  mutation UpdateSchedule($userId: Int!, $input: UserInput!) {
    updateSchedule(userId: $userId, input: $input) {
      firstName
      lastName
      telegram
      startTime
      endTime
      address
    }
  }
`;
