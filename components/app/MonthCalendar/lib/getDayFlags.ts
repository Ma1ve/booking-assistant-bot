interface DayFlagsArgs {
  date: Date;
  today: number;
}

export const getDayFlags = ({ date, today }: DayFlagsArgs) => {
  const jsDate = new Date(date);

  const currDay = jsDate.getDate();
  const dayOfWeek = jsDate.getDay();

  return {
    currDay,
    isPast: currDay < today,
    isToday: today === currDay,
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
  };
};
