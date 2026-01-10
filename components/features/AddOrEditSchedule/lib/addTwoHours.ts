export const addTwoHours = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(hours)) return "";

  const newHours = (hours + 2) % 24;

  const formattedHours = String(newHours).padStart(2, "0");
  const formattedMinutes = String(minutes || 0)
    .padEnd(2, "0")
    .slice(0, 2);

  return `${formattedHours}:${formattedMinutes}`;
};
