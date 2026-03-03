"use client";

import { useTelegramAuth } from "@/components/providers/TelegramAuthGate";

import { MonthData, AdminMonthSchedule } from "../../AdminMonthSchedule";
import { UserMonthSchedule } from "../../UserMonthSchedule";

interface RoleViewProps {
  months: MonthData[];
}

export const RoleView = ({ months }: RoleViewProps) => {
  const telegramAuth = useTelegramAuth();

  if (telegramAuth.isAdmin) return <AdminMonthSchedule months={months} />;

  return <UserMonthSchedule chatId={telegramAuth.chatId} />;
};
