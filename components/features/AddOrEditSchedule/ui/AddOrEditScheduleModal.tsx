import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/shared/ui/Input/CustomInput";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { addUserSchema, TUserForm } from "../lib/addUserSchema";

import { revalidateMainPath } from "@/components/shared/lib/revalidateMainPath";
import { handleApolloError } from "@/components/shared/lib/handleApolloError";

import { useScheduleMutations } from "../hooks/useScheduleMutations";

import { mapFormToScheduleInput } from "../lib/mapFormToScheduleInput";
import { getIsDisabledBtn } from "../lib/getIsDisabledBtn";
import { getScheduleFormDefaults } from "../lib/getScheduleFormDefaults";
import { notifyUserAndCloseModal } from "../lib/notifyUserAndCloseModal";
import { mapScheduleInfo } from "../lib/mapScheduleInfo";
import { getDialogText } from "../lib/formText";
import { addTwoHours } from "../lib/addTwoHours";

import { AddOrEditScheduleLoader } from "./AddOrEditScheduleLoader";

interface AddOrEditScheduleModalProps {
  date: string;
  isOpen: boolean;
  isAdd: boolean;
  defaultValues?: Partial<TUserForm> | null;
  onClose: () => void;
}

export function AddOrEditScheduleModal(props: AddOrEditScheduleModalProps) {
  const { date, isOpen, isAdd, defaultValues, onClose } = props;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TUserForm>({
    resolver: zodResolver(addUserSchema),
    defaultValues: getScheduleFormDefaults(defaultValues),
    mode: "onSubmit",
  });

  const watchedFields = watch();
  const isDisabledBtn = getIsDisabledBtn({ isAdd, watchedFields });

  const { create, update, loading } = useScheduleMutations({ date });

  const onSubmit = async (formData: TUserForm) => {
    const inputUser = mapFormToScheduleInput({ formData, date });

    try {
      const userId = isAdd
        ? await create({ input: inputUser })
        : await update({ userId: Number(defaultValues!.id), input: inputUser });

      await notifyUserAndCloseModal({
        isAdd,
        userId,
        scheduleInfo: mapScheduleInfo({ input: inputUser, date }),
        closeModal: () => onClose(),
      });

      await revalidateMainPath();
    } catch (error) {
      handleApolloError(error);
    }
  };

  const { dialogTitle, dialogBtnText, btnText } = getDialogText({ isAdd });

  if (loading) {
    return <AddOrEditScheduleLoader isAdd={isAdd} />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Как только вы нажмете {dialogBtnText}, при введенном telegram пользователя, сообщение о
            записи продублируется у пользователя
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4">
            <CustomInput
              name={"firstName"}
              label={"Имя"}
              placeholder="Иван"
              errorMessage={errors.firstName?.message}
              register={register}
            />

            <CustomInput
              name={"lastName"}
              label={"Фамилия"}
              placeholder="Подзоров"
              errorMessage={errors.lastName?.message}
              register={register}
            />
          </div>

          <CustomInput
            maxLength={33}
            name={"telegram"}
            label={"Telegram"}
            placeholder="@username"
            errorMessage={errors.telegram?.message}
            register={register}
            registerOptions={{
              onChange: (e) => {
                const val = e.target.value;

                if (val === "") {
                  e.target.value = "";
                  return;
                }

                if (!val.startsWith("@")) {
                  e.target.value = "@" + val;
                }
              },
            }}
          />

          <div className="flex gap-4">
            <CustomInput
              maxLength={5}
              name={"startTime"}
              label={"Начало приема:"}
              placeholder="00:00"
              errorMessage={errors.startTime?.message}
              register={register}
              registerOptions={{
                onChange: (e) => {
                  let val = e.target.value.replace(/[^0-9:]/g, "");

                  if (!val.includes(":") && val.length > 2) {
                    val = val.slice(0, 2) + ":" + val.slice(2);
                  }

                  if (/^\d:/.test(val)) {
                    val = "0" + val;
                  }

                  e.target.value = val;

                  if (val.length === 5) {
                    const newEndTime = addTwoHours(val);
                    setValue("endTime", newEndTime);
                  }
                },
              }}
            />

            <CustomInput
              maxLength={5}
              name={"endTime"}
              label={"Конец приема:"}
              placeholder="00:00"
              errorMessage={errors.endTime?.message}
              register={register}
              registerOptions={{
                onChange: (e) => {
                  let val = e.target.value.replace(/[^0-9:]/g, "");

                  if (!val.includes(":") && val.length > 2) {
                    val = val.slice(0, 2) + ":" + val.slice(2);
                  }

                  if (/^\d:/.test(val)) {
                    val = "0" + val;
                  }

                  e.target.value = val;
                },
              }}
            />
          </div>

          <CustomInput
            name={"address"}
            label={"Адрес:"}
            placeholder="​Загородное шоссе, 2, Москва"
            errorMessage={errors.address?.message}
            register={register}
          />

          <DialogFooter className="mt-7 flex-col gap-3">
            <Button disabled={isDisabledBtn} type="submit" className="text-white bg-green-700">
              {btnText}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Закрыть
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
