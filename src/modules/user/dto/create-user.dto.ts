import { User } from "@prisma/client";

export interface CreateUserDTO
  extends Omit<User, "id" | "password" | "createdAt" | "updatedAt"> {
  reqPassword: string;
}
