import { TUserForm } from "./addUserSchema";
import { normalizeTelegram } from "./normalizeTelegram";

interface CreateScheduleInput {
  formData: TUserForm;
  date: string;
}

export function mapFormToScheduleInput({ formData, date }: CreateScheduleInput) {
  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    telegram: normalizeTelegram(formData.telegram),
    startTime: formData.startTime,
    endTime: formData.endTime,
    address: formData.address,
    date,
  };
}
