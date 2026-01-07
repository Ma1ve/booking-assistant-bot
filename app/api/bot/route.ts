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

    if (update.message?.text !== "/start") {
      return NextResponse.json({ ok: true });
    }

    const chatId = update.message.chat.id.toString();
    const username = update.message.chat.username ?? null;

    const telegramAccount = await prisma.telegramAccount.upsert({
      where: { chatId },
      update: {
        username,
      },
      create: {
        chatId,
        username,
      },
    });

    if (username && !telegramAccount.userId) {
      const user = await prisma.user.findFirst({
        where: { telegram: username },
      });

      if (user) {
        await prisma.telegramAccount.update({
          where: { chatId },
          data: { userId: user.id },
        });
      }
    }

    await bot.sendMessage(chatId, "Привет! Теперь я смогу присылать тебе уведомления 👌");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Ошибка Webhook:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
