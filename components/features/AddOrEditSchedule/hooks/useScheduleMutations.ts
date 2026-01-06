import { useCreateSchedule } from "./useCreateSchedule";
import { useUpdateSchedule } from "./useUpdateSchedule";

import { TUserForm } from "../lib/addUserSchema";

interface ScheduleMutationsArgs {
  date: string;
  scheduleId: number;
}

export const useScheduleMutations = ({ date, scheduleId }: ScheduleMutationsArgs) => {
  const [createScheduleMutation, { loading: loadingCreate }] = useCreateSchedule(date);
  const [updateScheduleMutation, { loading: loadingUpdate }] = useUpdateSchedule(date);

  const create = async ({ input }: { input: TUserForm }) => {
    const { data } = await createScheduleMutation({
      variables: { scheduleId, input },
    });

    const id = Number(data?.createSchedule?.id);
    if (!id) throw new Error("Не удалось создать запись");

    return id;
  };

  const update = async ({ userId, input }: { userId: number; input: TUserForm }) => {
    await updateScheduleMutation({
      variables: { scheduleId, userId, input },
    });

    return userId;
  };

  return {
    create,
    update,
    loading: loadingCreate || loadingUpdate,
  };
};
