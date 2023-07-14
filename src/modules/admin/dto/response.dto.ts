import { Admin } from "@prisma/client";

export type ResponseAdminDTO = Omit<Admin, "password">;

export type ResponseDishDTO<T> = Omit<T, "createdAt" | "updatedAt">;
