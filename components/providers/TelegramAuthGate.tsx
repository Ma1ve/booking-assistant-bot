"use client";

import { useEffect, useState } from "react";
import { useRawInitData } from "@telegram-apps/sdk-react";
import { retrieveRawInitData } from "@tma.js/sdk";

export function TelegramAuthGate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const initData = retrieveRawInitData();
    console.log(initData, " init");
  });

  if (allowed === null) return <div>Проверка доступа…</div>;
  if (!allowed) return <div>Нет доступа</div>;

  return <>{children}</>;
}
