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
import { GetAdminListQueryDTO } from "../dto/get-admin-query.dto";

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

    const totalAdmin = await this.prisma.admin.count();

    return {
      roles,
      total,
      totalAdmin,
    };
  };

  getAdminList = async ({
    page = "1",
    role,
  }: GetAdminListQueryDTO): Promise<GetAdminListDTO> => {
    const limit = 5;

    const total = role
      ? await this.prisma.admin.count({
          where: {
            roles: {
              some: {
                role: {
                  position: role,
                },
              },
            },
          },
        })
      : await this.prisma.admin.count();

    const totalPages = Math.ceil(total / limit);

    if (parseInt(page) > totalPages) {
      throw new Error();
    }

    const adminList = await this.prisma.admin.findMany({
      skip: (parseInt(page) - 1) * limit,
      take: limit,
      where: {
        roles: {
          some: {
            role: {
              position: role,
            },
          },
        },
      },
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
    };
  };

  getAdminById = async (
    idAdmin: string,
    idAuth: string
  ): Promise<GetAdminDTO | null> => {
    const adminAuth = await this.prisma.admin.findUnique({
      where: {
        id: idAuth,
        roles: {
          some: {
            role: {
              position: "admin",
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!adminAuth) {
      throw new Error();
    }

    const admin = await this.prisma.admin.findUnique({
      where: {
        id: idAdmin,
      },
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

    return admin;
  };
}

export default AdminService;
