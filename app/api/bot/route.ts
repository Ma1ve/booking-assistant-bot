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
      let telegramAccount = await prisma.telegramAccount.findUnique({ where: { chatId } });
      let personId: number | null = null;

      if (telegramAccount) {
        if (!telegramAccount.personId) {
          const person = await prisma.person.create({});
          personId = person.id;

          await prisma.telegramAccount.update({
            where: { id: telegramAccount.id },
            data: { personId },
          });
        } else {
          personId = telegramAccount.personId;
        }
      } else {
        const person = await prisma.person.create({ data: {} });
        personId = person.id;

        telegramAccount = await prisma.telegramAccount.create({
          data: { chatId, username, personId },
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          person: {
            telegram: {
              username: username,
            },
          },
        },
      });

      if (user) {
        await prisma.user.update({ where: { id: user.id }, data: { personId } });
      }
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
