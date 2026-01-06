export function getDialogTitle({ isAdd }: { isAdd: boolean }) {
  return isAdd ? "Добавить запись" : "Редактировать запись";
}

export function getDialogBtnText({ isAdd }: { isAdd: boolean }) {
  return isAdd ? "«Записать»" : "«Изменить»";
}

export function getButtonText({ dialogBtnText }: { dialogBtnText: string }) {
  return dialogBtnText.replace(/[«»]/g, "");
}

export function getDialogText({ isAdd }: { isAdd: boolean }) {
  const dialogBtnText = getDialogBtnText({ isAdd });
  const dialogTitle = getDialogTitle({ isAdd });
  const btnText = getButtonText({ dialogBtnText });

  return {
    dialogBtnText,
    dialogTitle,
    btnText,
  };
}
