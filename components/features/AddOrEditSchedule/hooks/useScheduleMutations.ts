import { useCreateSchedule } from "./useCreateSchedule";
import { useUpdateSchedule } from "./useUpdateSchedule";

import { TUserForm } from "../lib/addUserSchema";

interface ScheduleMutationsArgs {
  date: string;
}

export const useScheduleMutations = ({ date }: ScheduleMutationsArgs) => {
  const [createScheduleMutation, { loading: loadingCreate }] = useCreateSchedule(date);
  const [updateScheduleMutation, { loading: loadingUpdate }] = useUpdateSchedule(date);

  const create = async ({ input }: { input: TUserForm }) => {
    const { data } = await createScheduleMutation({
      variables: { input },
    });

    const id = Number(data?.createSchedule?.id);
    if (!id) throw new Error("Не удалось создать запись");

    return id;
  };

  const update = async ({ userId, input }: { userId: number; input: TUserForm }) => {
    await updateScheduleMutation({
      variables: { userId, input },
    });

    return userId;
  };

  return {
    create,
    update,
    loading: loadingCreate || loadingUpdate,
  };
};
