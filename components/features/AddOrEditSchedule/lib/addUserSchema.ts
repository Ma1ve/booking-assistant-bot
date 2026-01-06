import { z } from "zod";

export const addUserSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "Введите имя"),
  lastName: z.string().min(1, "Введите фамилию"),
  telegram: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (val.length >= 5 && val.length <= 32 && /^@\w+$/.test(val)),
      { message: "Telegram должен начинаться с @ + 5 символов" }
    ),
  startTime: z.string().regex(/^([0-1]?\d|2[0-3]):[0-5]\d$/, "Введите HH:MM"),
  endTime: z.string().regex(/^([0-1]?\d|2[0-3]):[0-5]\d$/, "Введите HH:MM"),
  address: z.string().min(1, "Введите адрес"),
});

export type TUserForm = z.infer<typeof addUserSchema>;
