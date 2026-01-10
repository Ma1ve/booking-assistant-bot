"use server";

import { DateTime } from "luxon";
import { TIME_ZONE } from "@/components/shared/consts/timeZone";

import { bot } from "@/app/api/bot/route";
import { prisma } from "@/lib/prisma";

import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

interface MessageToTelegramArgs {
  userId: number;
  address: string;
  startTime: string;
  endTime: string;
  firstName: string;
  lastName: string;
  date: string;
}

interface TelegramNotificationResult {
  toastText: string;
  toastType: "success" | "error" | "warning";
}

function formatDateToDDMMYYYY(dateInput: string) {
  return DateTime.fromISO(dateInput).setZone(TIME_ZONE).toFormat("dd.MM.yyyy");
}

export async function sendMessageToTelegram({
  userId,
  address,
  startTime,
  endTime,
  firstName,
  lastName,
  date,
}: MessageToTelegramArgs): Promise<TelegramNotificationResult> {
  try {
    const telegramAccount = await prisma.telegramAccount.findFirst({
      where: {
        person: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    });

    if (!telegramAccount?.chatId) {
      return {
        toastText:
          "Уведомление не будет отправлено пользователю, он не написал боту команду /start",
        toastType: "warning",
      };
    }

    const formatDate = formatDateToDDMMYYYY(date);

    const userText =
      `📌 Вы записаны:\n` +
      `Дата: ${formatDate}\n` +
      `Время приема: с ${startTime} до ${endTime}\n\n` +
      `* Указанный интервал может отличаться от фактического времени услуги. Мы закладываем время, чтобы вы могли спокойно прийти и уйти без спешки, сам прием в среднем длиться в районе 75 минут \n\n` +
      `📍 Адрес: ${address}`;

    await bot.sendMessage(telegramAccount.chatId, userText);

    const adminText =
      `📌 Новая запись отправлена:\n` +
      `Имя: ${firstName} ${lastName}\n` +
      `Telegram: @${telegramAccount.username}\n\n` +
      `Дата: ${formatDate}\n` +
      `Время аренды: с ${startTime} до ${endTime}\n\n` +
      `📍 Адрес: ${address}`;

    await bot.sendMessage(process.env.ADMIN_CHAT_ID!, adminText);

    return {
      toastText: "Уведомление о записи успешно отправлено!",
      toastType: "success",
    };
  } catch (error) {
    console.error("Telegram notification error:", error);
    return {
      toastText: "Не удалось отправить уведомление в Telegram",
      toastType: "error",
    };
  }
}
