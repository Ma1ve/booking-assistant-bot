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

    // <div className="relative min-h-screen w-full flex justify-center px-3.75 overflow-hidden">
    //   {/* Фоновое изображение на весь экран */}
    //   <div className="absolute inset-0 -z-10">
    //     <img
    //       src="https://i.pinimg.com/736x/91/03/f4/9103f4440d01ed31d17957d38a9f4df3.jpg"
    //       alt="Background"
    //       className="w-full h-full object-cover brightness-50"
    //     />
    //   </div>

    //   {/* Основной контент */}
    //   <div className="relative z-10 w-full max-w-sm">
    //     <TelegramAuthGate>
    //       <RoleView days={daysWithUserCount} />
    //     </TelegramAuthGate>
    //   </div>
    // </div>
  );
}
