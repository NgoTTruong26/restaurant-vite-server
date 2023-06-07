import prisma from "../../configs/prisma.config";
import { signInDTO } from "./dto/sign-in.dto";
import { SignUpDTO } from "./dto/sign-up.dto";
import { ResponseUserDTO } from "../user/dto/response-user.dto";
import { compare, encrypt } from "../../helpers/encryption.utils";

const signIn = async ({
  username,
  reqPassword,
}: signInDTO): Promise<ResponseUserDTO | null> => {
  const data = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!data) {
    return null;
  }

  const { password, ...user } = data;

  if (!(await compare(reqPassword, password))) {
    return null;
  }

  return user;
};

const signUp = async (payload: SignUpDTO): Promise<ResponseUserDTO> => {
  const { reqPassword, repeatPassword, ...data } = payload;

  const { password, ...user } = await prisma.user.create({
    data: {
      ...data,
      password: await encrypt(reqPassword),
    },
  });

  return user;
};

const getProfile = async (userId: string): Promise<ResponseUserDTO | null> => {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!data) {
    return null;
  }
  const { password, ...user } = data;
  return user;
};

export { signIn, signUp, getProfile };
