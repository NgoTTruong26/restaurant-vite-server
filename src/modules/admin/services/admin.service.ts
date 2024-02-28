import { PrismaClient } from '@prisma/client';
import prismaClient from '../../../configs/prisma.config';
import { encrypt } from '../../../helpers/encryption.helper';
import { CreateAdminDTO } from '../dto/admin.dto';
import { GetAdminListRequest } from '../dto/get-admin-query.dto';
import { GetAdminDTO, GetAdminListDTO } from '../dto/get-admins.dto';
import { GetRoleListDTO, GetRoleListRequest } from '../dto/get-roles.dto';
import {
  ChangePasswordAdminByIdDTO,
  DataUpdateAdmin,
  IDataUpdateRolesAdmin,
  UpdateProfileAdminDTO,
} from '../dto/update-admin.dto';

class AdminService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  createAdmin = async (payload: CreateAdminDTO): Promise<GetAdminDTO> => {
    const { repeat_password, phoneNumber, ...data } = payload;

    const { password, ...admin } = await this.prisma.admin.create({
      data: {
        ...data,
        phone: phoneNumber,
        password: await encrypt(data.password),
        gender: data.gender
          ? {
              connect: {
                id: data.gender,
              },
            }
          : undefined,
        roles: data.roles
          ? {
              connect: data.roles.map((role) => ({
                id: role.roleId,
              })),
            }
          : undefined,
      },
      include: {
        gender: {
          select: {
            id: true,
            gender: true,
          },
        },
        roles: {
          select: {
            id: true,
            position: true,
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
          gender: 'male',
        },
        {
          gender: 'female',
        },
        {
          gender: 'other',
        },
      ],
    });
  };

  createManyNews = async () => {
    const newsPreview = await this.prisma.news.createMany({
      data: [
        {
          srcImg:
            'https://chefdzung.com.vn/uploads/images/album/untitled-1-1200x676-9.jpg',
          title: 'aaaaaaaaaaaa ',
          content: 'bbbbbbbbbbbbbbbbbbbbb',
          introduce: 'helooooooooooooo',
        },
      ],
    });

    return newsPreview;
  };

  updateProfileAdmin = async (
    payload: UpdateProfileAdminDTO,
  ): Promise<GetAdminDTO> => {
    const dataUpdate: DataUpdateAdmin = {
      fullName: payload.fullName,
      nationality: payload.nationality,
    };

    if (!isNaN(new Date(`${payload.dateBirth}`).getFullYear())) {
      dataUpdate.dateBirth = new Date(`${payload.dateBirth}`);
    }

    if (payload.gender) {
      dataUpdate.gender = {
        connect: {
          id: payload.gender,
        },
      };
    }

    const { password, ...admin } = await this.prisma.admin.update({
      data: {
        ...dataUpdate,
      },
      where: { id: payload.id },
      include: {
        gender: {
          select: {
            id: true,
            gender: true,
          },
        },
        roles: {
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    return admin;
  };

  updateRolesAdmin = async (
    payload: IDataUpdateRolesAdmin,
  ): Promise<GetAdminDTO> => {
    console.log(payload.adminId);

    const admin = await this.prisma.admin.update({
      where: { id: payload.adminId },
      data: {
        roles: {
          connect: payload.roles.reduce<{ id: string }[]>((prevs, curr) => {
            return [...prevs, { id: curr.roleId }];
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

        fullName: true,
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

  changePassword = async (
    payload: ChangePasswordAdminByIdDTO,
  ): Promise<GetAdminDTO> => {
    const data = await this.prisma.admin.update({
      where: {
        id: payload.id,
      },
      data: {
        password: await encrypt(payload.newPassword),
      },
      select: {
        id: true,
        username: true,

        fullName: true,
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

    return data;
  };

  getProfileAdmin = async (adminId?: string): Promise<GetAdminDTO | null> => {
    if (!adminId) {
      return null;
    }

    const data = await this.prisma.admin.findUnique({
      where: {
        id: adminId,
      },
      select: {
        id: true,
        username: true,

        fullName: true,
        email: true,
        phone: true,
        roles: {
          select: {
            id: true,
            position: true,
          },
          orderBy: {
            position: 'asc',
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

    if (!data) {
      return null;
    }

    return data;
  };

  getRoles = async ({
    page,
    search,
    limit,
  }: GetRoleListRequest): Promise<GetRoleListDTO | null> => {
    const [roles, total] = await this.prisma.$transaction([
      this.prisma.role.findMany({
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        select: {
          id: true,
          position: true,
        },
      }),
      this.prisma.role.count(),
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    if (totalPages === 0) {
      return null;
    }

    if (parseInt(page) > totalPages) {
      console.log(parseInt(page), totalPages);

      throw new Error();
    }

    return {
      roles,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      previousPage: parseInt(page) > 0 ? parseInt(page) - 1 : null,
      nextPage:
        total > parseInt(page) * parseInt(limit) ? parseInt(page) + 1 : null,
    };
  };

  getAdminList = async ({
    page = '1',
    role,
    search,
  }: GetAdminListRequest): Promise<GetAdminListDTO | null> => {
    const limit = 6;

    console.log(search);

    const total = await this.prisma.admin.count({
      where: {
        fullName: {
          contains: search,
        },
        AND: role.map((id) => ({
          roles: {
            some: {
              id,
            },
          },
        })),
      },
    });

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
      where: {
        fullName: {
          contains: search,
        },
        AND: role.map((id) => ({
          roles: {
            some: {
              id,
            },
          },
        })),
      },
      select: {
        id: true,
        username: true,

        fullName: true,
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
      totalAdmins: total,
    };
  };

  getAdminById = async (
    idAdmin: string,
    idAuth: string,
  ): Promise<GetAdminDTO | null> => {
    const adminAuth = await this.prisma.admin.findUnique({
      where: {
        id: idAuth,
        roles: {
          some: {
            position: 'admin',
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

        fullName: true,
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

  deleteAdmins = async (): Promise<void> => {
    await this.prisma.admin.deleteMany({
      where: { id: { in: [] } },
    });
  };
}

export default AdminService;
