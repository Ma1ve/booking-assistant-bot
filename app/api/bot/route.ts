import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import TelegramBot from "node-telegram-bot-api";

export const bot = new TelegramBot(process.env.BOT_TOKEN!, {
  polling: false,
});

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    console.log("Получено обновление от Telegram:", update);

    if (update.message?.text !== "/start" && update.message?.text !== "/info") {
      return NextResponse.json({ ok: true });
    }

    const chatId = update.message.chat.id.toString();
    const username = update.message.chat.username ?? null;

    if (update.message?.text == "/info") {
      const infoText =
        `✨ Добро пожаловать!\n\n` +
        `Данный бот создан для более комфортной записи на приемы. \n\n` +
        `С его помощью вы сможете просматривать ваши текущие записи, получать уведомления. \n\n` +
        `Нажмите /start чтобы начать`;

      await bot.sendMessage(chatId, infoText);
      return NextResponse.json({ ok: true });
    }

    if (username) {
      // Upsert: создаёт Account + Person если новый, обновляет username если уже есть
      const account = await prisma.telegramAccount.upsert({
        where: { chatId },
        update: { username },
        create: {
          chatId,
          username,
          person: { create: {} },
        },
      });

      // Страховка для старых аккаунтов без Person
      let personId = account.personId;
      if (!personId) {
        const person = await prisma.person.create({});
        personId = person.id;
        await prisma.telegramAccount.update({
          where: { id: account.id },
          data: { personId },
        });
      }

      // Привязываем существующие записи User к этому Person
      await prisma.user.updateMany({
        where: { person: { telegram: { username } } },
        data: { personId },
      });
    }

    const startText =
      `Готово! Теперь я на связи и смогу присылать вам уведомления 🔔\n\n` +
      `📆 Ваше расписание и подробности встреч находятся в разделе "Ваши записи"`;

    await bot.sendMessage(chatId, startText);

    const adminText = `Оповещения для @${username} включены 🔔`;
    await bot.sendMessage(process.env.ADMIN_CHAT_ID!, adminText);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Ошибка Webhook:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
