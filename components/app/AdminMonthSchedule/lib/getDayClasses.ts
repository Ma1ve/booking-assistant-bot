interface DayClasses {
  isToday: boolean;
  isWeekend: boolean;
  isPast: boolean;
}

export function getDayClasses({ isToday, isWeekend, isPast }: DayClasses) {
  if (isToday) return "bg-green-900 border border-lime-400";
  if (isPast) return "bg-black text-gray-500";
  if (isWeekend) return "bg-rose-950";
  return "bg-zinc-800";
}
