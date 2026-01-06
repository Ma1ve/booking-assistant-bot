import { TUserForm } from "./addUserSchema";
import { getIsFormValid } from "./getIsFormValid";

interface DisabledBtnArgs {
  isAdd: boolean;
  watchedFields: TUserForm;
}

export function getIsDisabledBtn({ isAdd, watchedFields }: DisabledBtnArgs) {
  return isAdd ? getIsFormValid({ watchedFields }) : false;
}
