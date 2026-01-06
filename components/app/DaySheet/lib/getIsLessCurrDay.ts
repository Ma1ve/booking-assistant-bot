interface LessCurrDayArgs {
  currDate?: Date;
}

export const getIsLessCurrDay = ({ currDate }: LessCurrDayArgs) => {
  if (!currDate) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(currDate);
  date.setHours(0, 0, 0, 0);

  return date < today;
};
