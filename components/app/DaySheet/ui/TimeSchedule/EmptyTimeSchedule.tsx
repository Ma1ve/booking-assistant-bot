import { Dispatch, SetStateAction } from "react";

import { NotebookPen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { ScheduleMode } from "../../types/ScheduleMode";

interface EmptyTimeScheduleProps {
  isLessCurrDay: boolean;
  setMode: Dispatch<SetStateAction<ScheduleMode>>;
}

export const EmptyTimeSchedule = ({ setMode, isLessCurrDay }: EmptyTimeScheduleProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <NotebookPen />
        </EmptyMedia>
        <EmptyTitle>Записей пока нет</EmptyTitle>
        <EmptyDescription>
          Здесь будут отображаться записи клиентов. Вы можете добавить первую запись прямо сейчас
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button disabled={isLessCurrDay} onClick={() => setMode("add")}>
            Добавить запись
          </Button>
        </div>
      </EmptyContent>
      <Button variant="link" asChild className="text-muted-foreground" size="sm"></Button>
    </Empty>
  );
};
