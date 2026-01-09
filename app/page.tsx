import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";

import { RoleView } from "@/components/app/RoleView/ui/RoleView";
import { TIME_ZONE } from "@/components/shared/consts/timeZone";
import { TelegramAuthGate } from "@/components/providers/TelegramAuthGate";

export default async function Home() {
  const now = DateTime.now().setZone(TIME_ZONE);

  const startOfMonth = now.startOf("month");
  const endOfMonth = now.endOf("month");

  let days = await prisma.daySchedule.findMany({
    where: { date: { gte: startOfMonth.toJSDate(), lte: endOfMonth.toJSDate() } },
    orderBy: { date: "asc" },
    include: { users: true },
  });

  if (days.length === 0) {
    if (!now.isValid || !startOfMonth.isValid) {
      throw new Error("Не удалось рассчитать даты для расписания");
    }

    await prisma.dayScheduleUser.deleteMany();
    await prisma.daySchedule.deleteMany();

    const daysInMonth = now.daysInMonth;
    const newDays = Array.from({ length: daysInMonth }, (_, i) => ({
      date: startOfMonth.plus({ days: i }).toJSDate(),
    }));

    await prisma.daySchedule.createMany({ data: newDays });

    days = await prisma.daySchedule.findMany({
      where: { date: { gte: startOfMonth.toJSDate(), lte: endOfMonth.toJSDate() } },
      orderBy: { date: "asc" },
      include: { users: true },
    });
  }

  const daysWithUserCount = days.map((day) => ({
    sheduleId: day.id,
    date: day.date,
    userCount: day.users.length,
  }));

  return (
    <TelegramAuthGate>
      <RoleView days={daysWithUserCount} />
    </TelegramAuthGate>
  );
}
