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

    const tomorrowUsers = await prisma.user.findMany({
      where: {
        date: {
          gte: startOfTomorrow,
          lte: endOfTomorrow,
        },
      },
      include: {
        person: { include: { telegram: true } },
      },
    });

    if (tomorrowUsers.length === 0) {
      console.log("На завтра записей не найдено");
      return;
    }

    const usersData = tomorrowUsers.map((user) => ({
      address: user.address,
      startTime: DateTime.fromJSDate(user.startTime).setZone(TIME_ZONE).toFormat("HH:mm"),
      endTime: DateTime.fromJSDate(user.endTime).setZone(TIME_ZONE).toFormat("HH:mm"),
      chatId: user.person?.telegram?.chatId,
    }));

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
        `* Указанный интервал может отличаться от фактического времени услуги. Мы закладываем время, чтобы вы могли спокойно прийти и уйти без спешки, сам прием длится в районе 75 минут \n\n` +
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
