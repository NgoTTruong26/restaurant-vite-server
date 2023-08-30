import jwt from "jsonwebtoken";

import prisma from "../configs/prisma.config";
import {
  IPayloadAuthToken,
  IPayloadAuthTokenAdmin,
} from "../interfaces/token.interfaces";
import { ResponseAdminDTO } from "../modules/admin/dto/response.dto";
import { GetUserDTO } from "../modules/user/dto/get-user.dto";

interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}

const generateToken = (payload: IPayloadAuthToken): string => {
  return jwt.sign(
    { userId: payload.userId } as IPayloadAuthToken,
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION!,
    }
  );
};

const generateTokenAdmin = (payload: IPayloadAuthTokenAdmin): string => {
  return jwt.sign(
    { adminId: payload.adminId } as IPayloadAuthTokenAdmin,
    process.env.JWT_SECRET_ADMIN!,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION!,
    }
  );
};

const generateAuthRefreshToken = async (
  payload: IPayloadAuthToken
): Promise<string> => {
  const refreshToken = jwt.sign(
    { userId: payload.userId } as IPayloadAuthToken,
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  await prisma.refreshToken.create({
    data: {
      user: {
        connect: {
          id: payload.userId,
        },
      },
      token: refreshToken,
    },
  });

  return refreshToken;
};

const generateAuthTokens = async (
  user: GetUserDTO
): Promise<AuthTokensResponse> => {
  const accessToken = generateToken({ userId: user.id });

  const refreshToken = await generateAuthRefreshToken({ userId: user.id });

  return {
    accessToken,
    refreshToken,
  };
};

const generateAdminAuthTokens = async (
  admin: ResponseAdminDTO
): Promise<AuthTokensResponse> => {
  const accessToken = generateTokenAdmin({ adminId: admin.id });

  const refreshToken =
    await "a"; /* generateAuthRefreshToken({ userId: user.id }); */

  return {
    accessToken,
    refreshToken,
  };
};

export {
  generateToken,
  generateTokenAdmin,
  generateAuthTokens,
  generateAuthRefreshToken,
  generateAdminAuthTokens,
};
