import { PrismaClient, User } from '@prisma/client';
import { encrypt } from '../../helpers/encryption.utils';
import { CreateUserDTO } from './dto/create-user.dto';
import {
  ChangePasswordDTO,
  DataUpdate,
  UpdateProfileDTO,
} from './dto/update-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import prismaClient from '../../configs/prisma.config';
import exclude from '../../configs/exclude.config';
import { compare } from 'bcryptjs';
import { GetUserDTO } from './dto/get-user.dto';
import { GetGenderDTO } from './dto/get-gender.dto';

class UserService {
  constructor(private prisma: PrismaClient = prismaClient) {}

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

  updateSecurityUser = async (
    payload: UpdateProfileDTO,
  ): Promise<GetUserDTO> => {
    const { id, ...dataUpdate } = payload;

    const { password, ...user } = await this.prisma.user.update({
      data: {
        fullName: dataUpdate.fullName,
        dateBirth: new Date(`${payload.dateBirth}`) || undefined,
      },
      where: { id },
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

    const data = await this.prisma.user.update({
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
