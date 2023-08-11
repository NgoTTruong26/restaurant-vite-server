import { User } from "@prisma/client";

export interface GetUserDTO
  extends Omit<User, "password" | "createdAt" | "updatedAt"> {}
