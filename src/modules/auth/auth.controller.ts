import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import getPrismaRequestError from '../../helpers/getPrismaRequestError.helper';
import { errorResponse, successResponse } from '../../helpers/response.helper';
import {
  IAuthRequest,
  IBodyRequest,
  IRefreshTokenRequest,
} from '../../interfaces/request.interface';
import {
  IAuthDecodeToken,
  IPayloadAuthToken,
} from '../../interfaces/token.interfaces';
import { EJWTError } from '../../middlewares/verify.middleware';
import * as tokenService from '../../services/token.service';
import AuthService from './auth.service';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { signInDTO } from './dto/sign-in.dto';
import { SignUpDTO } from './dto/sign-up.dto';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signIn = async (
    req: IBodyRequest<signInDTO, keyof signInDTO>,
    res: Response,
  ) => {
    try {
      const user = await this.authService.signIn(req.body);

      const { accessToken, refreshToken } =
        await tokenService.generateAuthTokens(user);

      res.cookie(process.env.REFRESH_TOKEN!, refreshToken, {
        httpOnly: false,
        secure: false, // lúc deploy thì để true
        sameSite: 'strict',
      });

      res.send(
        successResponse({ ...user, accessToken }, 'Sign In successfully'),
      );
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, 'User not found'));
    }
  };

  signUp = async (
    req: IBodyRequest<SignUpDTO, keyof SignUpDTO>,
    res: Response,
  ) => {
    try {
      const user = await this.authService.signUp(req.body);

      res.send(successResponse(user, 'Sign Up successfully'));
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(
            errorResponse(
              StatusCodes.BAD_REQUEST,
              getPrismaRequestError(error.code, error.meta?.target as any),
            ),
          );
      }

      res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, 'BAD_REQUEST'));
    }
  };

  getProfileCheckAuth = async (
    req: IAuthRequest<IPayloadAuthToken>,
    res: Response,
  ) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.send(successResponse<null>(null, ''));
    }

    const user = await this.authService.getProfileCheckAuth(userId);

    if (!user) return res.send(successResponse<null>(null, ''));

    res.send(successResponse(user, ''));
  };

  refreshToken = async (
    req: IRefreshTokenRequest<RefreshTokenDTO, IAuthDecodeToken>,
    res: Response,
  ) => {
    try {
      const refreshToken = req.cookies['refresh_token'];

      if (req.err_jwt_exp === EJWTError.EXPIRED_ERROR) {
        await this.authService.deleteRefreshToken(refreshToken);

        res.clearCookie(process.env.REFRESH_TOKEN!);

        return res
          .status(StatusCodes.FORBIDDEN)
          .send(
            errorResponse(StatusCodes.FORBIDDEN, 'Phiên đăng nhập hết hạn'),
          );
      }

      if (!req.user) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .send(errorResponse(StatusCodes.FORBIDDEN, 'You are not authorized'));
      }

      await this.authService.refreshToken(req.user, refreshToken);

      const accessToken = tokenService.generateToken(req.user);

      res.send(successResponse({ accessToken }, 'Successfully'));
    } catch (error) {
      console.log(error);

      res.clearCookie(process.env.REFRESH_TOKEN!);

      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, 'Refresh token invalid'));
    }
  };
}

export default AuthController;
