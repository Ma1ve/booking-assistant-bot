export function getFormatTime(date: Date): string {
  const d = new Date(date);

  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");

  return `${h}:${m}`;
}
