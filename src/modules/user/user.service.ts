import { User } from "@prisma/client";
import prisma from "../../configs/prisma.config";
import { encrypt } from "../../helpers/encryption.utils";
import { CreateUserDTO } from "./dto/create-user.dto";
import { ResponseUserDTO } from "./dto/response-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { DeleteUserDTO } from "./dto/delete-user.dto";

const getUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};

const getUserById = async (id: string): Promise<ResponseUserDTO | null> => {
  const data = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return data;
};

const createUser = async (payload: CreateUserDTO): Promise<ResponseUserDTO> => {
  const { reqPassword, ...data } = payload;

  const { password, ...user } = await prisma.user.create({
    data: {
      ...data,
      password: await encrypt(reqPassword),
    },
  });

  return user;
};

const updateUser = async (
  payload: UpdateUserDTO
): Promise<ResponseUserDTO | null> => {
  try {
    const { id, reqPassword, ...dataUpdate } = payload;

    const { password, ...user } = await prisma.user.update({
      data: {
        ...dataUpdate,
        password: reqPassword && (await encrypt(reqPassword)),
      },
      where: { id },
    });

    return user;
  } catch (error) {
    console.log(error);

    return null;
  }
};

const deleteUser = async ({
  id,
}: DeleteUserDTO): Promise<Pick<ResponseUserDTO, "id"> | null> => {
  try {
    return await prisma.user.delete({
      where: {
        id,
      },
      select: { id: true },
    });
  } catch (error) {
    return null;
  }
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
