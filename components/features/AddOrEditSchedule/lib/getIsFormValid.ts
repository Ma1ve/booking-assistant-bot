import { TUserForm } from "./addUserSchema";

export const getIsFormValid = ({
  watchedFields,
}: {
  watchedFields: TUserForm;
}) => {
  const fieldsToCheck = { ...watchedFields };
  delete fieldsToCheck.telegram;

  const hasAnyValue = Object.values(fieldsToCheck).some(
    (value) => typeof value === "string" && value.trim().length > 0
  );

  const allFieldsFilled = Object.values(fieldsToCheck).every((value) => {
    return typeof value === "string" && value.trim().length > 0;
  });

  return !(hasAnyValue && allFieldsFilled);
};
