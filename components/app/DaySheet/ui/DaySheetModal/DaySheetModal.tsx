"use client";

import { memo } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { IDaySchedule } from "@/components/app/AdminMonthSchedule";

import { TimeSchedule } from "../TimeSchedule/TimeSchedule";

import { getSheetTitle } from "../../lib/getSheetTitle";

interface DaySheetModalProps {
  selectedDay: IDaySchedule | null;
  onClose: () => void;
}

export const DaySheetModal = memo(function DaySheetModal({
  selectedDay,
  onClose,
}: DaySheetModalProps) {
  const isOpen = selectedDay !== null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="w-full h-full p-3 bg-black/10 backdrop-blur-md ">
        <SheetHeader>
          <SheetTitle className="text-center text-xl font-bold">
            {selectedDay ? getSheetTitle(selectedDay.date) : ""}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Модальное окно с расписанием на выбранный день
          </SheetDescription>
        </SheetHeader>

        <TimeSchedule selectedDay={selectedDay} />
      </SheetContent>
    </Sheet>
  );
});
