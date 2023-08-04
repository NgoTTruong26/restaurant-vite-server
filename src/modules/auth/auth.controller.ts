import { Request, Response } from "express";
import {
  IAuthRequest,
  IBodyRequest,
  ICookiesResponse,
} from "../../interfaces/request.interfaces";
import AuthService from "./auth.service";
import { signInDTO } from "./dto/sign-in.dto";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../../helpers/response.helper";
import * as tokenService from "../../services/token.service";
import { SignUpDTO } from "./dto/sign-up.dto";
import { RefreshTokenDTO } from "./dto/refresh-token.dto";
import jwt from "jsonwebtoken";
import {
  IAuthDecodeToken,
  payloadAuthToken,
} from "../../interfaces/token.interfaces";
import { Prisma } from "@prisma/client";
import getPrismaRequestError from "../../helpers/getPrismaRequestError.helper";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signIn = async (
    req: IBodyRequest<signInDTO, keyof signInDTO>,
    res: Response
  ) => {
    try {
      const user = await this.authService.signIn(req.body);

      const { accessToken, refreshToken } =
        await tokenService.generateAuthTokens(user);

      res.cookie(process.env.REFRESH_TOKEN!, refreshToken, {
        httpOnly: false,
        secure: false, // lúc deploy thì để true
        sameSite: "strict",
      });

      res.send(
        successResponse({ ...user, accessToken }, "Sign In successfully")
      );
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "User not found"));
    }
  };

  signUp = async (
    req: IBodyRequest<SignUpDTO, keyof SignUpDTO>,
    res: Response
  ) => {
    try {
      const user = await this.authService.signUp(req.body);

      res.send(successResponse(user, "Sign Up successfully"));
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(
            errorResponse(
              StatusCodes.BAD_REQUEST,
              getPrismaRequestError(error.code, error.meta?.target as any)
            )
          );
      }

      res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "BAD_REQUEST"));
    }
  };

  profile = async (req: IAuthRequest<IAuthDecodeToken>, res: Response) => {
    console.log(req.user);

    const accessToken = req.user?.userId;

    if (!accessToken) {
      return res.send(successResponse<null>(null, ""));
    }

    const user = await this.authService.getProfile(accessToken);

    if (!user) return res.send(successResponse<null>(null, ""));

    res.send(successResponse(user, ""));
  };

  refreshToken = async (
    req: ICookiesResponse<RefreshTokenDTO>,
    res: Response
  ) => {
    try {
      let payload: payloadAuthToken;

      const refreshToken = req.cookies["refresh_token"];

      jwt.verify(refreshToken, process.env.JWT_SECRET!, (err, decode) => {
        if (err) {
          console.log(err);
          throw new Error(err.message);
        }

        payload = { userId: (decode as IAuthDecodeToken).userId };
      });

      const newRefreshToken = await this.authService.refreshToken(
        payload!,
        refreshToken
      );

      const accessToken = tokenService.generateToken(payload!);

      res.cookie(process.env.REFRESH_TOKEN!, newRefreshToken, {
        httpOnly: true,
        secure: false, // lúc deploy thì để true
        sameSite: "strict",
      });

      res.send(successResponse({ accessToken }, "Successfully"));
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "Refresh token invalid"));
    }
  };
}

export default AuthController;
