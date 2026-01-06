const getTitleDayAndMonth = (day: Date | null) =>
  day?.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

const getWeekDayName = (day: Date | null) =>
  day?.toLocaleDateString("ru-RU", {
    weekday: "long",
  });

export const getSheetTitle = (day: Date) => {
  const currDay = new Date(day);

  const titleDayOfMonth = getTitleDayAndMonth(currDay);
  const titleOfWeek = getWeekDayName(day);

  if (!titleDayOfMonth && !titleOfWeek) return "";

  return `${titleDayOfMonth} | ${titleOfWeek}`;
};
