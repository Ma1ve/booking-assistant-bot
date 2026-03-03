import { gql } from "@apollo/client";

export const GET_ALL_USER_SCHEDULES = gql`
  query GetAllUserSchedules($chatId: String!) {
    getAllUserSchedules(chatId: $chatId) {
      id
      date
      startTime
      endTime
      address
      telegram
    }
  }
`;
