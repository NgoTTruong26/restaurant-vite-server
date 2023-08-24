import { Admin, PrismaClient } from "@prisma/client";
import { CreateAdminDTO } from "../dto/admin.dto";
import { encrypt } from "../../../helpers/encryption.utils";
import { ResponseAdminDTO } from "../dto/response.dto";
import {
  GetAdminDTO,
  GetAdminListDTO,
  GetAdminsByRoleDTO,
} from "../dto/get-admins.dto";
import prismaClient from "../../../configs/prisma.config";
import { GetRoleDTO, GetRoleListDTO } from "../dto/get-roles.dto";

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

  getRoles = async (): Promise<GetRoleListDTO> => {
    const roles = await this.prisma.role.findMany({
      select: {
        id: true,
        position: true,
      },
    });

    const total = await this.prisma.role.count();

    return {
      roles,
      total,
    };
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

  getAdminList = async (page: string): Promise<GetAdminListDTO> => {
    const limit = 5;

    const total = await this.prisma.admin.count();

    const totalPages = Math.ceil(total / limit);

    if (parseInt(page) > totalPages) {
      throw new Error();
    }

    const adminList = await this.prisma.admin.findMany({
      skip: (parseInt(page) - 1) * limit,
      take: limit,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                position: true,
              },
            },
          },
        },
      },
    });

    return {
      adminList,
      page: parseInt(page),
      totalPages,
      previousPage: parseInt(page) > 0 ? parseInt(page) - 1 : null,
      nextPage: total > parseInt(page) * limit ? parseInt(page) + 1 : null,
      total,
    };
  };
}

export default AdminService;
