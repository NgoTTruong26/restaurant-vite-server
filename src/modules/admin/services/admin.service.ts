import { Admin, PrismaClient } from "@prisma/client";
import { CreateAdminDTO } from "../dto/admin.dto";
import { encrypt } from "../../../helpers/encryption.utils";
import { ResponseAdminDTO } from "../dto/response.dto";
import { GetAdminsByRoleDTO } from "../dto/get-admins.dto";
import prismaClient from "../../../configs/prisma.config";

class AdminService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  createAdmin = async (payload: CreateAdminDTO): Promise<ResponseAdminDTO> => {
    const { reqPassword, ...data } = payload;

    const { password, ...admin } = await this.prisma.admin.create({
      data: {
        ...data,
        password: await encrypt(reqPassword),
        roles: {
          create: {
            role: {
              connect: {
                id: "100364690328125440",
              },
            },
            modifiedByAdmin: {
              connect: {
                id: "clitr86xz0008vv6ct6l73vcg",
              },
            },
          },
        },
      },
    });

    return admin;
  };

  getAdminByRole = async (
    payload: GetAdminsByRoleDTO
  ): Promise<ResponseAdminDTO[]> => {
    const admins = await this.prisma.admin.findMany({
      where: {
        roles: {
          some: {
            role: {
              position: payload.position,
            },
          },
        },
      },
    });

    return admins;
  };
}

export default AdminService;
