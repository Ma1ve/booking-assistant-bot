import { gql } from "@apollo/client";

export const CREATE_SCHEDULE = gql`
  mutation CreateSchedule($scheduleId: Int!, $input: UserInput!) {
    createSchedule(scheduleId: $scheduleId, input: $input) {
      id
    }
  }
`;
