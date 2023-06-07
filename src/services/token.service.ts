import jwt from "jsonwebtoken";
import { IAuthToken } from "../interfaces/token.interfaces";
import { ResponseUserDTO } from "../modules/user/dto/response-user.dto";

interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}

const generateToken = (userId: string, expiresIn: string | number) => {
  const payload = { userId };
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
};

const generateAuthTokens = (user: ResponseUserDTO): AuthTokensResponse => {
  const accessToken = generateToken(
    user.id,
    process.env.JWT_ACCESS_EXPIRATION!
  );

  const refreshToken = generateToken(
    user.id,
    process.env.JWT_REFRESH_EXPIRATION!
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = (token: string) => {};

const decodeToken = (token: string) => {
  let decodeToken: string | jwt.JwtPayload | undefined;
  jwt.verify(token, process.env.JWT_SECRET!, (err, decode) => {
    if (err) {
      console.log(err);

      return;
    }
    if (!(decode as IAuthToken).userId) {
      return;
    }

    decodeToken = (decode as IAuthToken).userId;
    return;
  });

  return decodeToken!;
};

export { generateAuthTokens, decodeToken };
