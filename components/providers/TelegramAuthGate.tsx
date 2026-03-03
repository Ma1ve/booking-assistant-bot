"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { retrieveRawInitData } from "@tma.js/sdk";
import { Spinner } from "../ui/spinner";

interface TelegramAuthValue {
  isAdmin: boolean;
  chatId: string;
}

const TelegramAuthContext = createContext<TelegramAuthValue | null>(null);

export function useTelegramAuth() {
  const context = useContext(TelegramAuthContext);
  if (context === null) {
    throw new Error("useTelegramAuth must be used within TelegramAuthGate");
  }
  return context;
}

const isDev = process.env.NODE_ENV === "development";

export function TelegramAuthGate({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(isDev ? true : null);
  const [chatId, setChatId] = useState<string | null>(isDev ? "" : null);

  useEffect(() => {
    if (isDev) return;

    const initData = retrieveRawInitData();
    fetch("/api/check-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setIsAdmin(data.isAdmin);
          setChatId(String(data.user.id));
          console.log("Доступ разрешён");
        } else {
          console.warn("Доступ запрещён:", data.error);
        }
      });
  }, []);

  const telegramAuthValue = useMemo(() => {
    return { isAdmin: isAdmin as boolean, chatId: chatId as string };
  }, [isAdmin, chatId]);

  if (isAdmin === null || chatId === null)
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner className="size-15" />
      </div>
    );

  return (
    <TelegramAuthContext.Provider value={telegramAuthValue}>
      {children}
    </TelegramAuthContext.Provider>
  );
}
