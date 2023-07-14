import { Admin } from "@prisma/client";

export interface CreateAdminDTO
  extends Omit<Admin, "id" | "password" | "createdAt" | "updatedAt"> {
  reqPassword: string;
}
