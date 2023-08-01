import { User } from "@prisma/client";

export interface signInDTO extends Pick<User, "username"> {
  reqPassword: string;
}
