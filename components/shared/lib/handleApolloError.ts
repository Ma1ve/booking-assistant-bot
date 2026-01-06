import { CombinedGraphQLErrors } from "@apollo/client";
import { toast } from "sonner";

export function handleApolloError(error: unknown) {
  let message = "Произошла ошибка";

  if (CombinedGraphQLErrors.is(error)) {
    message = error.message;
  }

  toast.error(message);
}
