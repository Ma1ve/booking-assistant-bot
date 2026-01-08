"use client";

import { useTelegramAuth } from "@/components/providers/TelegramAuthGate";

import { IDaySchedule, AdminMonthSchedule } from "../../AdminMonthSchedule";
import { UserMonthSchedule } from "../../UserMonthSchedule";

interface RoleViewProps {
  days: IDaySchedule[];
}

export const RoleView = ({ days }: RoleViewProps) => {
  const telegramAuth = useTelegramAuth();

  if (telegramAuth.isAdmin) return <AdminMonthSchedule days={days} />;

  return <UserMonthSchedule chatId={telegramAuth.chatId} />;
};
