import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import getPrismaRequestError from '../../../helpers/getPrismaRequestError.helper';
import {
  errorResponse,
  successResponse,
} from '../../../helpers/response.helper';
import {
  IAdminAuthRequest,
  IBodyRequest,
  IBodyRequestVerifyAdmin,
  IParamsRequestVerifyAdmin,
  IQueryRequest,
} from '../../../interfaces/request.interface';
import { IPayloadAuthTokenAdmin } from '../../../interfaces/token.interfaces';
import { CreateAdminDTO } from '../dto/admin.dto';
import { GetAdminParamsDTO } from '../dto/get-admin-params.dto';
import { GetAdminListQueryDTO } from '../dto/get-admin-query.dto';
import {
  ChangePasswordAdminDTO,
  IUpdateRolesAdminDTO,
  UpdateProfileAdminDTO,
} from '../dto/update-admin.dto';
import AdminService from '../services/admin.service';
import AdminAuthController from './adminAuth.controller';
import DishController from './dish.admin.controller';

class AdminController {
  private adminService: AdminService;
  readonly dishController: DishController;
  readonly adminAuthController: AdminAuthController;

  constructor() {
    this.adminService = new AdminService();
    this.dishController = new DishController();
    this.adminAuthController = new AdminAuthController();
  }

  createAdmin = async (
    req: IBodyRequest<CreateAdminDTO, keyof CreateAdminDTO>,
    res: Response,
  ) => {
    try {
      const admin = await this.adminService.createAdmin(req.body);
      res.send(successResponse(admin, 'Create Admin Successfully'));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error);

        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(
            errorResponse(
              StatusCodes.BAD_REQUEST,
              getPrismaRequestError(error.code, error.meta?.target as any),
            ),
          );
      }

      console.log(error);

      res.status(StatusCodes.BAD_REQUEST).send('Bad Request');
    }
  };

  createGenders = async (req: Request, res: Response) => {
    try {
      const news = await this.adminService.createGenders();
      res.send(successResponse(news, 'success'));
    } catch (error) {
      console.log(error);
    }
  };

  createManyNews = async (req: Request, res: Response) => {
    try {
      const news = await this.adminService.createManyNews();
      res.send(successResponse(news, 'success'));
    } catch (error) {
      console.log(error);
    }
  };

  updateProfileAdmin = async (
    req: IBodyRequest<UpdateProfileAdminDTO, keyof UpdateProfileAdminDTO>,
    res: Response,
  ) => {
    try {
      const admin = await this.adminService.updateProfileAdmin(req.body);

      res.send(successResponse(admin, 'Updated successfully'));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error);

        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(
            errorResponse(
              StatusCodes.BAD_REQUEST,
              getPrismaRequestError(error.code, error.meta?.target as any),
            ),
          );
      }
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, 'Admin not found'));
    }
  };

  changePassword = async (
    req: IBodyRequest<ChangePasswordAdminDTO, keyof ChangePasswordAdminDTO>,
    res: Response,
  ) => {
    try {
      const admin = await this.adminService.changePassword(req.body);

      res.send(successResponse(admin, ''));
    } catch (error) {
      console.log(error);

      res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, 'Bad Request'));
    }
  };

  updateRolesAdmin = async (
    req: IBodyRequestVerifyAdmin<
      IUpdateRolesAdminDTO,
      keyof IUpdateRolesAdminDTO,
      IPayloadAuthTokenAdmin
    >,
    res: Response,
  ) => {
    try {
      const admin = await this.adminService.updateRolesAdmin({
        ...req.body,
        modifiedByAdminId: req.admin!.adminId,
      });
      res.send(successResponse(admin, 'success'));
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send('Bad request');
      console.log(error);
    }
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

      const admin = await this.adminService.getProfileAdmin(adminId);

      res.send(successResponse(admin, 'Success'));
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.FORBIDDEN).send('Forbidden');
    }
  };

  getRoles = async (req: Request, res: Response) => {
    try {
      const data = await this.adminService.getRoles();
      res.send(successResponse(data, 'Success'));
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.BAD_REQUEST).send('Bad Request');
    }
  };

  getAdminList = async (
    req: IQueryRequest<GetAdminListQueryDTO>,
    res: Response,
  ) => {
    try {
      const data = await this.adminService.getAdminList(req.query);

      res.send(successResponse(data, 'Success'));
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.BAD_REQUEST).send('Bad Request');
    }
  };

  getAdminById = async (
    req: IParamsRequestVerifyAdmin<GetAdminParamsDTO, IPayloadAuthTokenAdmin>,
    res: Response,
  ) => {
    try {
      if (!req.admin?.adminId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(
            errorResponse(StatusCodes.UNAUTHORIZED, 'You are not authorized'),
          );
      }

      const data = await this.adminService.getAdminById(
        req.params.id,
        req.admin.adminId,
      );
      res.send(successResponse(data, 'Success'));
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.FORBIDDEN).send('Forbidden');
    }
  };
}

export default AdminController;
