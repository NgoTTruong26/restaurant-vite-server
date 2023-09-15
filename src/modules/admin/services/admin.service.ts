import { PrismaClient } from '@prisma/client';
import { CreateAdminDTO } from '../dto/admin.dto';
import { encrypt } from '../../../helpers/encryption.utils';
import { ResponseAdminDTO } from '../dto/response.dto';
import { GetAdminDTO, GetAdminListDTO } from '../dto/get-admins.dto';
import prismaClient from '../../../configs/prisma.config';
import { GetRoleDTO, GetRoleListDTO } from '../dto/get-roles.dto';
import { GetAdminListQueryDTO } from '../dto/get-admin-query.dto';
import {
  ChangePasswordAdminDTO,
  DataUpdateAdmin,
  IDataUpdateRolesAdmin,
  UpdateProfileAdminDTO,
} from '../dto/update-admin.dto';

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
              id: '',
              position: '',
            },
          ],
        },
        modifiedByAdmin: {
          connect: {
            id: '',
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
    payload: ChangePasswordAdminDTO,
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

  getRoles = async (): Promise<GetRoleListDTO> => {
    const roles = await this.prisma.role.findMany({
      select: {
        id: true,
        position: true,
      },
    });

    const total = await this.prisma.role.count();

    const totalAdmins = await this.prisma.admin.count();

    return {
      roles,
      total,
      totalAdmins,
    };
  };

  getAdminList = async ({
    page = '1',
    role,
    search,
  }: GetAdminListQueryDTO): Promise<GetAdminListDTO | null> => {
    const limit = 6;

    const total = await this.prisma.admin.count({
      where: {
        fullName: {
          contains: search,
        },
        roles: role
          ? {
              some: {
                position: role,
              },
            }
          : {},
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
        roles: role
          ? {
              some: {
                position: role,
              },
            }
          : {},
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
