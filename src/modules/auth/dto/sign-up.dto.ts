import { User } from "@prisma/client";

export interface SignUpDTO
  extends Pick<User, "firstName" | "lastName" | "username"> {
  reqPassword: string;
  repeatPassword: string;
  acceptTermsAndServices: boolean;
}
