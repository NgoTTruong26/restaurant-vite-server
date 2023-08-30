import { User } from "@prisma/client";

export type GetUserDTO = Omit<User, "password" | "createdAt" | "updatedAt">;
