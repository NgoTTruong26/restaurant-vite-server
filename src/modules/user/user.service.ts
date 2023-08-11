import { PrismaClient, User } from "@prisma/client";
import { encrypt } from "../../helpers/encryption.utils";
import { CreateUserDTO } from "./dto/create-user.dto";
import { ResponseUserDTO } from "./dto/response.dto";
import { DataUpdate, UpdateProfileDTO } from "./dto/update-user.dto";
import { DeleteUserDTO } from "./dto/delete-user.dto";
import prismaClient from "../../configs/prisma.config";
import exclude from "../../configs/exclude.config";

class UserService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  getUsers = async (): Promise<User[]> => {
    const users = await this.prisma.user.findMany();
    return users;
  };

  getUserById = async (id: string): Promise<ResponseUserDTO> => {
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

  createUser = async (payload: CreateUserDTO): Promise<ResponseUserDTO> => {
    const { reqPassword, repeatPassword, ...data } = payload;

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: await encrypt(reqPassword),
      },
    });

    return exclude<User, "password">(user, ["password"]);
  };

  updateProfileUser = async (
    payload: UpdateProfileDTO
  ): Promise<ResponseUserDTO> => {
    const dataUpdate: DataUpdate = {
      lastName: payload.lastname,
      firstName: payload.firstname,
      nationality: payload.nationality,
    };

    if (!isNaN(new Date(`${payload.dateBirth}`).getFullYear())) {
      dataUpdate.dateBirth = new Date(`${payload.dateBirth}`);
    }

    if (payload.gender) {
      dataUpdate.gender = {
        connect: {
          gender: payload.gender,
        },
      };
    }

    const { password, ...user } = await this.prisma.user.update({
      data: {
        ...dataUpdate,
      },
      where: { id: payload.id },
    });

    return user;
  };

  updateSecurityUser = async (
    payload: UpdateProfileDTO
  ): Promise<ResponseUserDTO> => {
    const { id, ...dataUpdate } = payload;

    const { password, ...user } = await this.prisma.user.update({
      data: {
        lastName: dataUpdate.lastname,
        firstName: dataUpdate.firstname,
        dateBirth: new Date(`${payload.dateBirth}`) || undefined,
      },
      where: { id },
    });

    return user;
  };

  deleteUser = async ({
    id,
  }: DeleteUserDTO): Promise<Pick<ResponseUserDTO, "id">> => {
    return await this.prisma.user.delete({
      where: {
        id,
      },
      select: { id: true },
    });
  };
}

export default UserService;
