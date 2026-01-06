export function getInitials(name: string) {
  const splitName = name.split(" ");

  const firstName = splitName[0][0].toUpperCase();
  const lastName = splitName[1][0].toUpperCase();

  return firstName + lastName;
}
