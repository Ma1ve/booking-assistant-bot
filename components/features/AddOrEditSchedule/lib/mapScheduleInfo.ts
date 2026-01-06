import { TUserForm } from "./addUserSchema";

interface ScheduleInfoArgs {
  date: string;
  input: TUserForm;
}

export function mapScheduleInfo({ input, date }: ScheduleInfoArgs) {
  return {
    date,
    address: input.address,
    startTime: input.startTime,
    endTime: input.endTime,
    firstName: input.firstName,
    lastName: input.lastName,
  };
}
