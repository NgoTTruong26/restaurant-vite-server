import { PrismaClient } from "@prisma/client";
import { CreateAdminDTO } from "../dto/admin.dto";
import { encrypt } from "../../../helpers/encryption.utils";
import { ResponseAdminDTO } from "../dto/response.dto";
import { GetAdminDTO, GetAdminListDTO } from "../dto/get-admins.dto";
import prismaClient from "../../../configs/prisma.config";
import { GetRoleDTO, GetRoleListDTO } from "../dto/get-roles.dto";
import { GetAdminListQueryDTO } from "../dto/get-admin-query.dto";
import {
  IDataUpdateRolesAdmin,
  IUpdateRolesAdminDTO,
} from "../dto/update-admin.dto";

class AdminService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  createAdmin = async (payload: CreateAdminDTO): Promise<ResponseAdminDTO> => {
    const { reqPassword, ...data } = payload;

    const { password, ...admin } = await this.prisma.admin.create({
      data: {
        ...data,
        password: await encrypt(reqPassword),
        roles: {
          connect: [
            {
              id: "",
              position: "",
            },
          ],
        },
        modifiedByAdmin: {
          connect: {
            id: "",
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

  updateRolesAdmin = async (
    payload: IDataUpdateRolesAdmin
  ): Promise<GetAdminDTO> => {
    console.log(payload.adminId);

    const admin = await this.prisma.admin.update({
      where: { id: payload.adminId },
      data: {
        roles: {
          connect: payload.roles.reduce<{ id: string }[]>((prevs, curr) => {
            if (typeof curr === "string") {
              return [...prevs, { id: curr }];
            }
            return prevs;
          }, []),
          disconnect: payload.removeRoles
            ? payload.removeRoles.map((role) => ({
                id: role,
              }))
            : [],
        },
        modifiedByAdmin: {
          connect: [{ id: payload.modifiedByAdminId }],
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
            id: true,
            position: true,
          },
        },
        dateBirth: true,
        gender: {
          select: {
            id: true,
            gender: true,
          },
        },
        nationality: true,
      },
    });

    return admin;
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
  }: GetAdminListQueryDTO): Promise<GetAdminListDTO | null> => {
    const limit = 5;

    const total = role
      ? await this.prisma.admin.count({
          where: {
            roles: {
              some: {
                position: role,
              },
            },
          },
        })
      : await this.prisma.admin.count();

    const totalPages = Math.ceil(total / limit);

    if (totalPages === 0) {
      return null;
    }

    if (parseInt(page) > totalPages) {
      throw new Error();
    }

    const adminList = await this.prisma.admin.findMany({
      skip: (parseInt(page) - 1) * limit,
      take: limit,
      where: role
        ? {
            roles: {
              some: {
                position: role,
              },
            },
          }
        : {},
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        roles: {
          select: {
            id: true,
            position: true,
          },
        },
        dateBirth: true,
        gender: {
          select: {
            id: true,
            gender: true,
          },
        },
        nationality: true,
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
            position: "admin",
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
            id: true,
            position: true,
          },
        },
        dateBirth: true,
        gender: {
          select: {
            id: true,
            gender: true,
          },
        },
        nationality: true,
      },
    });

    return admin;
  };
}

export default AdminService;
