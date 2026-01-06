interface AppointmentNowArgs {
  date: Date | undefined;
  startTime: string;
  endTime: string;
}

export const getIsAppointmentNow = ({
  date,
  startTime,
  endTime,
}: AppointmentNowArgs) => {
  if (!date) return false;

  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const now = new Date();

  const startTimeDate = new Date(date);
  startTimeDate.setHours(startHours, startMinutes, 0, 0);

  const endTimeDate = new Date(date);
  endTimeDate.setHours(endHours, endMinutes, 0, 0);

  return startTimeDate <= now && endTimeDate >= now;
};
