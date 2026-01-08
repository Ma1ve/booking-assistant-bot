import { AlertCircle } from "lucide-react";

export const UserMonthScheduleError = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 scale-150 animate-pulse bg-red-100 dark:bg-red-900/20 rounded-full blur-2xl" />
        <div className="relative bg-white dark:bg-zinc-950 p-4 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/30">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
      </div>

      <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Упс! Что-то пошло не так
      </h1>
      <p className="mb-8 max-w-md text-zinc-500 dark:text-zinc-400">
        Произошла непредвиденная ошибка при загрузке расписания. Если проблема продолжается написать
        @malfeag
      </p>
    </div>
  );
};
