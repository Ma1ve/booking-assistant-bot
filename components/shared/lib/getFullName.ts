interface getFullNameArgs {
  firstName: string;
  lastName: string;
}

export const getFullName = ({ firstName, lastName }: getFullNameArgs) =>
  `${firstName.trim()} ${lastName.trim()}`;
