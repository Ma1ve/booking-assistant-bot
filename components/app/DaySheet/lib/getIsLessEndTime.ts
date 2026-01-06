interface LessEndTimeArgs {
  date: Date | undefined;
  endTime: string;
}

export const getIsLessEndTime = ({ date, endTime }: LessEndTimeArgs) => {
  if (!date) return false;

  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const now = new Date();

  const dateEndTime = new Date(date);
  dateEndTime.setHours(endHours, endMinutes, 0, 0);

  return now > dateEndTime;
};
