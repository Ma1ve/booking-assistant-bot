import { toast } from "sonner";

import { useMutation } from "@apollo/client/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { getFullName } from "@/components/shared/lib/getFullName";
import { getInitials } from "@/components/shared/lib/getInitials";

import { TUserForm } from "@/components/features/AddOrEditSchedule";
import { DELETE_SCHEDULE_BY_ID } from "../../graphql/mutations/deleteScheduleById";
import { GET_CLOSEST_SCHEDULE_TODAY } from "@/components/app/NearestEntryDay/graphql/queries/getClosestScheduleToday";
import { Spinner } from "@/components/ui/spinner";
import { revalidateMainPath } from "@/components/shared/lib/revalidateMainPath";

import { GET_USER_BY_DAY } from "../../graphql/queries/getUserByDay";

interface ConfirmDeleteModalProps {
  date: string;
  isOpen: boolean;
  activeSchedule: TUserForm;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  date,
  isOpen,
  activeSchedule,
  onClose,
}: ConfirmDeleteModalProps) {
  const name = getFullName({
    firstName: activeSchedule.firstName,
    lastName: activeSchedule.lastName,
  });

  const [deleteScheduleById, { loading }] = useMutation(DELETE_SCHEDULE_BY_ID, {
    refetchQueries: [
      { query: GET_CLOSEST_SCHEDULE_TODAY },
      { query: GET_USER_BY_DAY, variables: { date } },
    ],
    awaitRefetchQueries: true,
  });

  const handleDeleteSchedule = async () => {
    try {
      await deleteScheduleById({
        variables: { userId: Number(activeSchedule.id) },
      });
      toast.success("Запись успешно удалена");

      onClose();

      await revalidateMainPath();
    } catch (error) {
      toast.error("Произошла ошибка при удалении записи");
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogDescription>Вы уверены, что хотите удалить данную запись?</DialogDescription>

          {loading ? (
            <div className="flex justify-center items-center">
              <Spinner className="py-5 size-20 text-white" />
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-white/10 bg-zinc-900 p-4 space-y-3">
              <div className="flex justify-center items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded text-zinc-100 text-md font-semibold select-none bg-orange-600">
                  {getInitials(name)}
                </div>

                <div className="flex flex-col">
                  <span className="text-white font-medium">{name}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-zinc-400">Адрес</span>
                <span className="text-white">{activeSchedule.address}</span>
              </div>

              <div className="flex justify-center items-center">
                <div className="flex flex-col">
                  <span className="text-sm text-zinc-400">Время приёма</span>
                  <span className="text-white font-medium">
                    {activeSchedule.startTime} — {activeSchedule.endTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-zinc-400">Telegram</span>
                <span className="text-white">{activeSchedule.telegram}</span>
              </div>
            </div>
          )}
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button disabled={loading} variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button
            disabled={loading}
            className={"bg-red-800 text-white"}
            onClick={handleDeleteSchedule}
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
