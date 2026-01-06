export function normalizeTelegram(username?: string) {
  if (!username) return username;
  return username.startsWith("@") ? username.slice(1) : username;
}
