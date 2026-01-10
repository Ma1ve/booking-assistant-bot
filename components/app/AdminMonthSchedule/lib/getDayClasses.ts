interface DayClasses {
  isToday: boolean;
  isWeekend: boolean;
  isPast: boolean;
}

export function getDayClasses({ isToday, isWeekend, isPast }: DayClasses) {
  if (isToday) return "bg-green-900 border border-lime-400";
  if (isPast) return "bg-black text-gray-500";
  if (isWeekend) return "bg-[#2f1c03]";
  return "bg-zinc-800";
}
