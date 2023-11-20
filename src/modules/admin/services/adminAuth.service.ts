import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import prismaClient from '../../../configs/prisma.config';
import { encrypt } from '../../../helpers/encryption.utils';
import { signInDTO } from '../../auth/dto/sign-in.dto';
import { GetAdminDTO } from '../dto/get-admins.dto';
import { ChangePasswordAdminDTO } from '../dto/update-admin.dto';

class AdminAuthService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  signIn = async ({
    username,
    reqPassword,
  }: signInDTO): Promise<GetAdminDTO> => {
    const data = await this.prisma.admin.findUnique({
      where: {
        username,
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

    if (!data) {
      throw new Error();
    }

    const { password, ...admin } = data;

    if (!(await compare(reqPassword, password))) {
      throw new Error();
    }

    return admin;
  };

  getProfileCheckAuth = async (
    adminId?: string,
  ): Promise<Pick<GetAdminDTO, 'id' | 'fullName'> | null> => {
    if (!adminId) {
      return null;
    }

    const data = await this.prisma.admin.findUnique({
      where: {
        id: adminId,
      },
      select: {
        id: true,
        fullName: true,
      },
    });

    if (!data) {
      return null;
    }

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

  changePassword = async (payload: ChangePasswordAdminDTO): Promise<void> => {
    const currentPassword = (
      await this.prisma.admin.findUnique({
        where: {
          id: payload.id,
        },
        select: {
          password: true,
        },
      })
    )?.password;

    if (!currentPassword) {
      throw new Error();
    }

    if (!(await compare(payload.oldPassword, currentPassword))) {
      throw new Error('old password is incorrect');
    }
    await this.prisma.admin.update({
      where: {
        id: payload.id,
      },
      data: {
        password: await encrypt(payload.newPassword),
      },
    });
  };
}

export default AdminAuthService;
