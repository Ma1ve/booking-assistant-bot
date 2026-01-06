import { User } from "@/lib/generated/prisma";

export type IUser = Omit<User, "startTime" | "endTime"> & {
  startTime: string;
  endTime: string;
};
