import { signInDTO } from "./dto/sign-in.dto";
import { SignUpDTO } from "./dto/sign-up.dto";
import { ResponseUserDTO } from "../user/dto/response.dto";
import { compare, encrypt } from "../../helpers/encryption.utils";
import {
  IAuthDecodeToken,
  payloadAuthToken,
} from "../../interfaces/token.interfaces";
import { generateAuthRefreshToken } from "../../services/token.service";
import { PrismaClient } from "@prisma/client";
import prismaClient from "../../configs/prisma.config";

class AuthService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  signIn = async ({
    username,
    reqPassword,
  }: signInDTO): Promise<ResponseUserDTO> => {
    const data = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!data) {
      throw new Error();
    }

    const { password, ...user } = data;

    if (!(await compare(reqPassword, password))) {
      throw new Error();
    }

    return user;
  };

  signUp = async (payload: SignUpDTO): Promise<ResponseUserDTO> => {
    const { reqPassword, repeatPassword, acceptTermsAndServices, ...data } =
      payload;

    const { password, ...user } = await this.prisma.user.create({
      data: {
        ...data,
        password: await encrypt(reqPassword),
      },
    });

    return user;
  };

  getProfile = async (userId?: string): Promise<ResponseUserDTO | null> => {
    if (!userId) {
      return null;
    }

    const data = await this.prisma.user.findUnique({
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

  refreshToken = async (
    payload: payloadAuthToken,
    refreshToken: string
  ): Promise<string> => {
    const data = await this.prisma.refreshToken.findMany({
      where: {
        userId: payload.userId,
      },
      select: {
        token: true,
      },
    });

    const refreshTokens = data.map((refreshToken) => refreshToken.token);

    if (!refreshTokens.includes(refreshToken)) throw new Error();

    await this.prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    return await generateAuthRefreshToken(payload);
  };
}

export default AuthService;
