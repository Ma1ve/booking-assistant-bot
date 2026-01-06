import { ScheduleMode } from "../types/ScheduleMode";

export function getModeFlags(mode: ScheduleMode) {
  return {
    isAddMode: mode === "add",
    isEditMode: mode === "edit",
    isDeleteMode: mode === "delete",
    isOpen: mode === "add" || mode === "edit",
  };
}
