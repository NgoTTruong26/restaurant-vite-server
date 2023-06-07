import { user } from "@prisma/client";

export interface signInDTO extends Pick<user, "username"> {
  reqPassword: string;
}
