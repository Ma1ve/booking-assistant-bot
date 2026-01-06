import { prisma } from "@/lib/prisma";

import { Badge } from "@/components/ui/badge";

import { MonthCalendarClient } from "@/components/app/MonthCalendar";

export default async function Home() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);

  let days = await prisma.daySchedule.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
    include: { users: true },
  });

  if (days.length === 0) {
    await prisma.dayScheduleUser.deleteMany();
    await prisma.daySchedule.deleteMany();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const newDays = Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, month, i + 1),
    }));

    await prisma.daySchedule.createMany({ data: newDays });

    days = await prisma.daySchedule.findMany({
      where: { date: { gte: start, lte: end } },
      orderBy: { date: "asc" },
      include: { users: true },
    });
  }

  const daysWithUserCount = days.map((day) => ({
    sheduleId: day.id,
    date: day.date,
    userCount: day.users.length,
  }));

  const fullDate = now?.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex justify-center h-full px-3.75">
      <div>
        <div className="text-center mt-10">
          <Badge variant="secondary">{fullDate}</Badge>
        </div>

        <MonthCalendarClient days={daysWithUserCount} />
      </div>
    </div>
  );
}
