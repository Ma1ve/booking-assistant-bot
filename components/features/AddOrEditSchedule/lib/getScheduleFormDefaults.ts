import { TUserForm } from "./addUserSchema";

export function getScheduleFormDefaults(defaultValues?: Partial<TUserForm> | null): TUserForm {
  return {
    firstName: "",
    lastName: "",
    telegram: "",
    startTime: "",
    endTime: "",
    address: "Пятницкая улица, 2/38с3",
    ...(defaultValues ?? {}),
  };
}
