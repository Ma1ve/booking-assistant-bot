import { gql } from "@apollo/client";

export const GET_USER_BY_DAY = gql`
  query UsersByDay($date: String!) {
    usersByDay(date: $date) {
      id
      firstName
      lastName
      startTime
      endTime
      telegram
      address
    }
  }
`;
