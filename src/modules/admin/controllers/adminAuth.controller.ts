import * as tokenService from '../../../services/token.service';

import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  errorResponse,
  successResponse,
} from '../../../helpers/response.helper';
import {
  IAdminAuthRequest,
  IAdminRefreshTokenRequest,
  IBodyRequest,
} from '../../../interfaces/request.interface';
import {
  IAuthDecodeTokenAdmin,
  IPayloadAuthTokenAdmin,
} from '../../../interfaces/token.interfaces';
import { signInDTO } from '../../auth/dto/sign-in.dto';
import { RefreshTokenAdminDTO } from '../dto/refresh-token-admin.dto';
import AdminAuthService from '../services/adminAuth.service';

class AdminAuthController {
  private adminAuthService: AdminAuthService;
  constructor() {
    this.adminAuthService = new AdminAuthService();
  }

  getProfileCheckAuth = async (
    req: IAdminAuthRequest<IPayloadAuthTokenAdmin>,
    res: Response,
  ) => {
    const adminId = req.admin?.adminId;

    if (!adminId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .send(errorResponse(StatusCodes.FORBIDDEN, 'You are not authorized'));
    }

    const admin = await this.adminAuthService.getProfileCheckAuth(adminId);

    if (!admin) return res.send(successResponse<null>(null, ''));

    res.send(successResponse(admin, ''));
  };

  getProfileAdmin = async (
    req: IAdminAuthRequest<IPayloadAuthTokenAdmin>,
    res: Response,
  ) => {
    try {
      const adminId = req.admin?.adminId;

      if (!adminId) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .send(errorResponse(StatusCodes.FORBIDDEN, 'You are not authorized'));
      }

      const admin = await this.adminAuthService.getProfileAdmin(adminId);

      res.send(successResponse(admin, 'Success'));
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.FORBIDDEN).send('Forbidden');
    }
  };

  changePassword = async (
    req: IAdminAuthRequest<IPayloadAuthTokenAdmin>,
    res: Response,
  ) => {
    try {
      await this.adminAuthService.changePassword({
        ...req.body,
        id: req.admin!.adminId,
      });

      res.send(successResponse(null));
    } catch (error) {
      console.log(error);

      res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, 'Bad Request'));
    }
  };

  signIn = async (
    req: IBodyRequest<signInDTO, keyof signInDTO>,
    res: Response,
  ) => {
    try {
      const admin = await this.adminAuthService.signIn(req.body);

      const { accessToken, refreshToken } =
        await tokenService.generateAuthTokensAdmin(admin);

      res.cookie(process.env.REFRESH_TOKEN_ADMIN!, refreshToken, {
        httpOnly: false,
        secure: false, // lúc deploy thì để true
        sameSite: 'strict',
      });

      res.send(
        successResponse({ ...admin, accessToken }, 'Sign In successfully'),
      );
    } catch (error) {
      console.log(error);

      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, 'admin not found'));
    }
  };

  refreshToken = async (
    req: IAdminRefreshTokenRequest<RefreshTokenAdminDTO, IAuthDecodeTokenAdmin>,
    res: Response,
  ) => {
    try {
      const refreshToken = req.cookies['refresh_token_admin'];

      /* if (req.err_jwt_exp === EJWTError.EXPIRED_ERROR) {
        await this.authService.deleteRefreshToken(refreshToken);

        res.clearCookie(process.env.REFRESH_TOKEN!);

        return res
          .status(StatusCodes.FORBIDDEN)
          .send(
            errorResponse(StatusCodes.FORBIDDEN, 'Phiên đăng nhập hết hạn'),
          );
      } */

      if (!req.admin) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .send(errorResponse(StatusCodes.FORBIDDEN, 'You are not authorized'));
      }

      /* await this.authService.refreshToken(req.admin, refreshToken); */

      const accessToken = tokenService.generateTokenAdmin(req.admin);

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

export default AdminAuthController;
