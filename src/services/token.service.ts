import jwt from "jsonwebtoken";
import {
  IAuthDecodeToken,
  payloadAuthToken,
} from "../interfaces/token.interfaces";
import { ResponseUserDTO } from "../modules/user/dto/response.dto";
import prisma from "../configs/prisma.config";

interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}

const generateToken = (payload: payloadAuthToken): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION!,
  });
};

const generateAuthRefreshToken = async (
  payload: payloadAuthToken
): Promise<string> => {
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION!,
  });

  await prisma.refreshToken.create({
    data: {
      userId: payload.userId,
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
