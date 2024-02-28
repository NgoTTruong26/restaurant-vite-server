import { PrismaClient } from '@prisma/client';
import prismaClient from '../../configs/prisma.config';
import { compare, encrypt } from '../../helpers/encryption.helper';
import { IPayloadAuthToken } from '../../interfaces/token.interfaces';
import { GetUserDTO } from '../user/dto/get-user.dto';
import { signInDTO } from './dto/sign-in.dto';
import { SignUpDTO } from './dto/sign-up.dto';

class AuthService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  signIn = async ({
    username,
    reqPassword,
  }: signInDTO): Promise<GetUserDTO> => {
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

  signUp = async (payload: SignUpDTO): Promise<GetUserDTO> => {
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

  getProfileCheckAuth = async (userId?: string): Promise<GetUserDTO | null> => {
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

    return data;
  };

  refreshToken = async (
    payload: IPayloadAuthToken,
    refreshToken: string,
  ): Promise<void> => {
    const data = await this.prisma.refreshToken.findMany({
      where: {
        userId: payload.userId,
      },
      select: {
        token: true,
      },
    });

    const refreshTokens = data.map((refreshToken) => refreshToken.token);

    if (!refreshTokens.includes(refreshToken)) {
      throw new Error();
    }
  };

  deleteRefreshToken = async (refreshToken: string) => {
    console.log(refreshToken);

    return await this.prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
  };
}

export default AuthService;
