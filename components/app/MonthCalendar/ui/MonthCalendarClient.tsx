"use client";

import { useEffect, useState } from "react";
import { useRawInitData } from "@telegram-apps/sdk-react";

import { NearesetEntryDay } from "@/components/app/NearestEntryDay";

import { MonthCalendar } from "./MonthCalendar";

import { IDaySchedule } from "../types/IDaySchedule";
import { getTodaySchedule } from "../lib/getTodaySchedule";

interface MonthCalendarClientProps {
  days: IDaySchedule[];
}

export function MonthCalendarClient({ days }: MonthCalendarClientProps) {
  const [selectedDay, setSelectedDay] = useState<IDaySchedule | null>(null);
  const [access, setAccess] = useState(false);

  const initData = useRawInitData();
  console.log(initData, "sdf");
  // useEffect(() => {
  //   /* @ts-ignore */
  //   fetch("/api/check-role", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ initData }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.ok && data.isAdmin) {
  //         setAccess(true);
  //       } else {
  //         setAccess(false);
  //       }
  //     });
  // }, []);
  // 1. Получаем данные инициализации

  const handleOpenTodaySchedule = () => {
    const currDay = getTodaySchedule(days);
    setSelectedDay(currDay);
  };

  // if (access === null) return <div>Проверка доступа...</div>;
  // if (!access) return <div>У вас нет доступа к приложению</div>;

  return (
    <>
      <NearesetEntryDay handleOpenTodaySchedule={handleOpenTodaySchedule} />

      <MonthCalendar days={days} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
    </>
  );
}
