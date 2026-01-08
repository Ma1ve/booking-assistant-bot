import { useQuery } from "@apollo/client/react";

import { UserMonthScheduleList } from "./UserMonthScheduleList";

import { GET_ALL_USER_SCHEDULES } from "../graphql/queries/getAllUserSchedules";

interface UserMonthScheduleProps {
  chatId: string;
}

export const UserMonthSchedule = ({ chatId }: UserMonthScheduleProps) => {
  console.log(chatId, "chayId");
  const { data, loading, error } = useQuery(GET_ALL_USER_SCHEDULES, {
    variables: { chatId },
  });

  console.log(data, "data");

  return <div>sdf</div>;

  //   return <UserMonthScheduleList userScheduleList={} />;
};
