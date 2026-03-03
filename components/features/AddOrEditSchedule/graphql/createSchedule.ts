import { gql } from "@apollo/client";

export const CREATE_SCHEDULE = gql`
  mutation CreateSchedule($input: UserInput!) {
    createSchedule(input: $input) {
      id
    }
  }
`;
