import { toast } from "sonner";
import { sendMessageToTelegram } from "../actions/sendMessageToTelegram";

interface ScheduleInfo {
  date: string;
  firstName: string;
  lastName: string;
  address: string;
  startTime: string;
  endTime: string;
}

interface notifyUserAndCloseModalArgs {
  isAdd: boolean;
  userId: number;
  scheduleInfo: ScheduleInfo;
  closeModal: () => void;
}

export async function notifyUserAndCloseModal({
  isAdd,
  userId,
  scheduleInfo,
  closeModal,
}: notifyUserAndCloseModalArgs) {
  const { date, address, startTime, endTime, firstName, lastName } = scheduleInfo;

  const toastTitleSuccess = isAdd ? "Запись создана" : "Запись изменена";
  toast.success(toastTitleSuccess);

  closeModal();

  const { toastText, toastType } = await sendMessageToTelegram({
    userId,
    date,
    address,
    startTime,
    endTime,
    firstName,
    lastName,
  });

  setTimeout(() => {
    toast[toastType](`${toastText}`);
  }, 800);
}
