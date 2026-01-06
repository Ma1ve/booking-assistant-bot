import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface AddOrEditScheduleLoaderProps {
  isAdd: boolean;
}

export const AddOrEditScheduleLoader = ({ isAdd }: AddOrEditScheduleLoaderProps) => {
  const title = isAdd ? "Создание записи…" : "Сохранение изменений…";
  const description = isAdd
    ? "Подождите, данные отправляются на сервер"
    : "Подождите, изменения сохраняются";

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px] h-[200px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div className="flex justify-center items-center">
            <Spinner className="py-5 size-20 text-white" />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
