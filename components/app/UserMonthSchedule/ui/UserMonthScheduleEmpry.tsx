import { BookSearch } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export const UserMonthScheduleEmpty = () => {
  return (
    <div className="flex flex-col gap-7 mx-10 mt-10">
      <div className="rounded-2xl border border-[#312e2e] bg-[#28282847] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] px-4 py-8">
        <Empty className="p-0">
          <EmptyHeader>
            <BookSearch className="w-7 h-7" />

            <EmptyTitle className="font-semibold text-md text-white">Записей пока нет</EmptyTitle>

            <EmptyDescription className="mt-2">
              <p className="text-gray-300 text-md leading-relaxed">
                Запланировать консультацию или уточнить детали —
                <a
                  href="https://web.telegram.org/k/#@flowredup"
                  className="ml-1.5 text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
                >
                  @flowredup
                </a>
              </p>
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm p-4">
        <p className="text-sm text-gray-400 leading-relaxed text-center">
          <span className="text-blue-400/90 font-semibold flex items-center justify-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Обратите внимание:
          </span>
          Для корректного отображения (если вы зашли впервые) необходимо отправить команду
          <code className="mx-1 text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded text-xs font-mono">
            /start
          </code>
          вашему боту.
        </p>
      </div>
    </div>
  );
};
