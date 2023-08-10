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

  createGenders = async () => {
    await this.prisma.gender.createMany({
      data: [
        {
          gender: "male",
        },
        {
          gender: "female",
        },
        {
          gender: "other",
        },
      ],
    });
  };

  createManyNews = async () => {
    const newsPreview = await this.prisma.news.createMany({
      data: [
        {
          srcImg:
            "https://chefdzung.com.vn/uploads/images/album/untitled-1-1200x676-9.jpg",
          title: "aaaaaaaaaaaa ",
          content: "bbbbbbbbbbbbbbbbbbbbb",
          introduce: "helooooooooooooo",
        },
      ],
    });

    return newsPreview;
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
