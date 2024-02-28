import { PrismaClient, User } from '@prisma/client';
import { compare } from 'bcryptjs';
import exclude from '../../configs/exclude.config';
import prismaClient from '../../configs/prisma.config';
import { encrypt } from '../../helpers/encryption.helper';
import { CreateUserDTO } from './dto/create-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { GetGenderDTO } from './dto/get-gender.dto';
import { GetUserDTO } from './dto/get-user.dto';
import {
  ChangePasswordDTO,
  DataUpdate,
  UpdateProfileDTO,
} from './dto/update-user.dto';

class UserService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  getProfile = async (userId?: string): Promise<GetUserDTO | null> => {
    if (!userId) {
      return null;
    }

    const data = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        gender: {
          select: {
            id: true,
            gender: true,
          },
        },
      },
    });

    if (!data) {
      return null;
    }
    const { password, ...user } = data;
    return user;
  };

  getGenders = async (): Promise<GetGenderDTO[]> => {
    const gender = await this.prisma.gender.findMany({
      select: {
        id: true,
        gender: true,
      },
    });

    return gender;
  };

  getUsers = async (): Promise<User[]> => {
    const users = await this.prisma.user.findMany();
    return users;
  };

  getUserById = async (id: string): Promise<GetUserDTO> => {
    const data = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        gender: {
          select: {
            id: true,
            gender: true,
          },
        },
      },
    });

    if (!data) throw new Error();

    return data;
  };

  createUser = async (payload: CreateUserDTO): Promise<GetUserDTO> => {
    const { reqPassword, repeatPassword, ...data } = payload;

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: await encrypt(reqPassword),
      },
    });

    return exclude<User, 'password'>(user, ['password']);
  };

  updateProfileUser = async (
    payload: UpdateProfileDTO,
  ): Promise<GetUserDTO> => {
    const dataUpdate: DataUpdate = {
      fullName: payload.fullName,
      nationality: payload.nationality,
      avatarUrl: payload.avatarUrl,
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

    const { password, ...user } = await this.prisma.user.update({
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
      },
    });

    return user;
  };

  changePassword = async (payload: ChangePasswordDTO): Promise<GetUserDTO> => {
    const currentPassword = (
      await this.prisma.user.findUnique({
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

    if (!(await compare(payload.password, currentPassword))) {
      throw new Error();
    }

    const { password, ...data } = await this.prisma.user.update({
      where: {
        id: payload.id,
      },
      data: {
        password: await encrypt(payload.newPassword),
      },
    });

    return data;
  };

  deleteUser = async ({
    id,
  }: DeleteUserDTO): Promise<Pick<GetUserDTO, 'id'>> => {
    return await this.prisma.user.delete({
      where: {
        id,
      },
      select: { id: true },
    });
  };
}

export default UserService;
