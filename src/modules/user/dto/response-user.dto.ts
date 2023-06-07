import { User } from "@prisma/client";

export type ResponseUserDTO = Omit<User, "password">;
