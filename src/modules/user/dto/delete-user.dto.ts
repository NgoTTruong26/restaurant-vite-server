import { User } from "@prisma/client";

export type DeleteUserDTO = Pick<User, "id">;
