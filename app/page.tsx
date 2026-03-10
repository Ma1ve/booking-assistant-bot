import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";

import { RoleView } from "@/components/app/RoleView/ui/RoleView";
import { TIME_ZONE } from "@/components/shared/consts/timeZone";
import { TelegramAuthGate } from "@/components/providers/TelegramAuthGate";
import { IDaySchedule, MonthData } from "@/components/app/AdminMonthSchedule";

function buildMonthDays(monthStart: DateTime, countByDate: Map<string, number>): IDaySchedule[] {
  const daysInMonth = monthStart.daysInMonth!;
  const firstDayOfWeek = monthStart.weekday;

  const placeholders: IDaySchedule[] = Array.from({ length: firstDayOfWeek - 1 }, () => ({
    date: null,
    userCount: 0,
  }));

  const days: IDaySchedule[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = monthStart.plus({ days: i });
    return {
      date: day.toJSDate(),
      userCount: countByDate.get(day.toISODate()!) ?? 0,
    };
  });

  return [...placeholders, ...days];
}

export default async function Home() {
  const now = DateTime.now().setZone(TIME_ZONE);
  const currentMonthStart = now.startOf("month");
  const nextMonthStart = currentMonthStart.plus({ months: 1 });
  const nextMonthEnd = nextMonthStart.endOf("month");

  const appointments = await prisma.user.findMany({
    where: {
      date: {
        gte: currentMonthStart.toJSDate(),
        lte: nextMonthEnd.toJSDate(),
      },
    },
    select: { date: true },
  });

  const countByDate = new Map<string, number>();
  for (const a of appointments) {
    const key = DateTime.fromJSDate(a.date).setZone(TIME_ZONE).startOf("day").toISODate()!;
    countByDate.set(key, (countByDate.get(key) ?? 0) + 1);
  }

  const months: MonthData[] = [
    {
      label: currentMonthStart.setLocale("ru").toFormat("LLLL yyyy"),
      days: buildMonthDays(currentMonthStart, countByDate),
    },
    {
      label: nextMonthStart.setLocale("ru").toFormat("LLLL yyyy"),
      days: buildMonthDays(nextMonthStart, countByDate),
    },
  ];

  return (
    <TelegramAuthGate>
      <RoleView months={months} />
    </TelegramAuthGate>
  );
}
