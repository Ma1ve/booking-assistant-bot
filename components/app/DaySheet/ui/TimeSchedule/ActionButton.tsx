import { Dispatch, SetStateAction } from "react";
import { List } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScheduleMode } from "../../types/ScheduleMode";

interface ActionButtonProps {
  setMode: Dispatch<SetStateAction<ScheduleMode>>;
}

export const ActionButton = ({ setMode }: ActionButtonProps) => {
  const handleAddShedule = () => {
    setMode("add");
  };

  const handleDeleteSchedule = () => {
    setMode("delete");
  };

  const handleEditShedule = () => {
    setMode("edit");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="
            absolute
            bottom-5
            right-5
            h-10 w-10
            rounded-full
            border border-muted
            hover:bg-muted
            transition
            shadow-sm
          "
        >
          <List className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleAddShedule}>Добавить запись</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditShedule}>Редактировать</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteSchedule}>Удалить</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
