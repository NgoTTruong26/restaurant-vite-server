import { PrismaClient } from "@prisma/client";
import prismaClient from "../../../configs/prisma.config";
import { signInDTO } from "../../auth/dto/sign-in.dto";
import { ResponseAdminDTO } from "../dto/response.dto";
import { compare } from "bcryptjs";

class AdminAuthService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  signIn = async ({
    username,
    reqPassword,
  }: signInDTO): Promise<ResponseAdminDTO> => {
    const data = await this.prisma.admin.findUnique({
      where: {
        username,
      },
      include: {
        roles: {
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!data) {
      throw new Error();
    }

    const { password, ...admin } = data;

    if (!(await compare(reqPassword, password))) {
      throw new Error();
    }

    return admin;
  };
}

export default AdminAuthService;
