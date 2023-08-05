import jwt from "jsonwebtoken";

import { ResponseUserDTO } from "../modules/user/dto/response.dto";
import prisma from "../configs/prisma.config";
import { IPayloadAuthToken } from "../interfaces/token.interfaces";

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

const generateAuthRefreshToken = async (
  payload: IPayloadAuthToken
): Promise<string> => {
  const refreshToken = jwt.sign(
    { userId: payload.userId } as IPayloadAuthToken,
    process.env.JWT_SECRET!,
    {
      expiresIn: "5s",
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
  user: ResponseUserDTO
): Promise<AuthTokensResponse> => {
  const accessToken = generateToken({ userId: user.id });

  const refreshToken = await generateAuthRefreshToken({ userId: user.id });

  return {
    accessToken,
    refreshToken,
  };
};

export { generateToken, generateAuthTokens, generateAuthRefreshToken };
