import { useState } from "react";

import { IDaySchedule } from "@/components/app/MonthCalendar/types/IDaySchedule";
import { AddOrEditScheduleModal, TUserForm } from "@/components/features/AddOrEditSchedule";

import { ScheduleMode } from "../../types/ScheduleMode";

import { TimeScheduleList } from "./TimeScheduleList";
import { EmptyTimeSchedule } from "./EmptyTimeSchedule";
import { ActionButton } from "./ActionButton";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { TimeScheduleError } from "./TimeScheduleError";
import { TimeScheduleLoader } from "./TimeScheduleLoader";

import { getIsLessCurrDay } from "../../lib/getIsLessCurrDay";
import { getModeFlags } from "../../lib/getModeFlags";
import { useUsersByDay } from "../../hooks/useUsersByDay";

interface TimeSchedulelProps {
  selectedDay: IDaySchedule | null;
}

export const TimeSchedule = ({ selectedDay }: TimeSchedulelProps) => {
  const [mode, setMode] = useState<ScheduleMode>("");
  const [activeSchedule, setActiveSchedule] = useState<TUserForm | null>(null);

  const { scheduleList, loading, error } = useUsersByDay({ selectedDay });

  if (loading) {
    return <TimeScheduleLoader />;
  }

  if (error) {
    return <TimeScheduleError />;
  }

  const handleCloseModal = () => {
    setMode("");
    setActiveSchedule(null);
  };

  const { isAddMode, isEditMode, isDeleteMode, isOpen } = getModeFlags(mode);

  const isLessCurrDay = getIsLessCurrDay({
    currDate: selectedDay?.date,
  });

  const isEmptyScheduleList = scheduleList === undefined || scheduleList.length === 0;

  const isShowCreateModal = selectedDay && isAddMode;
  const isShowEditModal = selectedDay && isEditMode && activeSchedule;
  const isShowDeleteModal = selectedDay && isDeleteMode && activeSchedule;

  return (
    <div>
      {isEmptyScheduleList ? (
        <EmptyTimeSchedule isLessCurrDay={isLessCurrDay} setMode={setMode} />
      ) : (
        <TimeScheduleList
          scheduleList={scheduleList}
          date={selectedDay?.date}
          mode={mode}
          setActiveSchedule={setActiveSchedule}
          setMode={setMode}
        />
      )}

      {!isLessCurrDay && <ActionButton setMode={setMode} />}

      {isShowDeleteModal && (
        <ConfirmDeleteModal
          date={selectedDay.date.toISOString()}
          isOpen={true}
          activeSchedule={activeSchedule}
          onClose={handleCloseModal}
        />
      )}

      {isShowEditModal && (
        <AddOrEditScheduleModal
          isOpen={isOpen}
          isAdd={isAddMode}
          scheduleId={selectedDay.sheduleId}
          date={selectedDay.date.toISOString()}
          onClose={handleCloseModal}
          defaultValues={activeSchedule}
        />
      )}

      {isShowCreateModal && (
        <AddOrEditScheduleModal
          isOpen={isOpen}
          isAdd={isAddMode}
          scheduleId={selectedDay.sheduleId}
          date={selectedDay.date.toISOString()}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
