import { gql } from "@apollo/client";

export const GET_ALL_USER_SCHEDULES = gql`
  query GetAllUserSchedules($chatId: String!) {
    getAllUserSchedules(chatId: $chatId) {
      user {
        firstName
        lastName
        startTime
        endTime
        address
        telegram
      }
      daySchedule {
        date
      }
    }
  }
`;
