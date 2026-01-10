import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import { TIME_ZONE } from "@/components/shared/consts/timeZone";
import { sleep } from "@/components/shared/lib/sleep";

import { bot } from "../bot/route";

export async function GET() {
  try {
    const now = DateTime.now().setZone(TIME_ZONE);

    const startOfTomorrow = now.plus({ days: 1 }).startOf("day").toJSDate();
    const endOfTomorrow = now.plus({ days: 1 }).endOf("day").toJSDate();

    const schedule = await prisma.daySchedule.findFirst({
      where: {
        date: {
          gte: startOfTomorrow,
          lte: endOfTomorrow,
        },
      },
      include: {
        users: { include: { user: { include: { person: { include: { telegram: true } } } } } },
      },
    });

    if (!schedule) {
      console.log("На завтра записей не найдено");
      return;
    }

    const usersData = schedule.users.map((item) => {
      const user = item.user;

      const address = user.address;
      const startTime = DateTime.fromJSDate(user.startTime).setZone(TIME_ZONE).toFormat("HH:mm");
      const endTime = DateTime.fromJSDate(user.endTime).setZone(TIME_ZONE).toFormat("HH:mm");
      const chatId = user.person?.telegram?.chatId;

      return {
        address,
        startTime,
        endTime,
        chatId,
      };
    });

    const uniqueUsersToNotify = usersData.filter(
      (user): user is typeof user & { chatId: string } =>
        Boolean(user?.chatId) &&
        usersData.findIndex((t) => t.chatId === user.chatId) === usersData.indexOf(user)
    );

    for (const item of uniqueUsersToNotify) {
      const { address, startTime, endTime, chatId } = item;

      const userText =
        `🔔 Напоминание о записи \n\n` +
        `📌 Вы записаны на завтра:\n` +
        `Время приема: с ${startTime} до ${endTime}\n\n` +
        `* Указанный интервал может отличаться от фактического времени услуги. Мы закладываем время, чтобы вы могли спокойно прийти и уйти без спешки, сам прием в среднем длиться в районе 75 минут \n\n` +
        `📍 Адрес: ${address}`;

      await bot.sendMessage(chatId, userText);
      await sleep(100);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("cron error", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
