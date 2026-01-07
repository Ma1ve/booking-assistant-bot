"use client";

import { useEffect, useState } from "react";
import { useRawInitData } from "@telegram-apps/sdk-react";
import { retrieveRawInitData } from "@tma.js/sdk";

export function TelegramAuthGate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const initData = retrieveRawInitData();
    console.log(initData, " init");
    /* @ts-ignore */
    console.log(window?.Telegram?.WebApp?.initData);

    fetch("/api/check-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          console.log(data, "data");
          console.log("Доступ разрешён");
        } else {
          console.warn("Доступ запрещён:", data.error);
        }
      });
  });

  if (allowed === null) return <div>Проверка доступа…</div>;
  if (!allowed) return <div>Нет доступа</div>;

  return <>{children}</>;
}
