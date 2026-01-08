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

export function TelegramAuthGate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    const initData = retrieveRawInitData();
    fetch("/api/check-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setAllowed(true);
          setIsAdmin(data.isAdmin);
          setChatId(data.user.id);
          console.log(data, "data");
          console.log("Доступ разрешён");
        } else {
          console.warn("Доступ запрещён:", data.error);
        }
      });
  }, []);

  const telegramAuthValue = useMemo(() => {
    return { isAdmin: isAdmin, chatId: chatId };
  }, [isAdmin, chatId]);

  if (allowed === null || isAdmin === null || chatId === null)
    return (
      <div className="flex justify-center items-center">
        <Spinner className="size-15" />
      </div>
    );

  return (
    // Поправить
    <TelegramAuthContext.Provider value={telegramAuthValue}>
      {children}
    </TelegramAuthContext.Provider>
  );
}
