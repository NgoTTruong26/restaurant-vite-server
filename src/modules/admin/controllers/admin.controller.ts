import { Request, Response } from "express";
import {
  IBodyRequest,
  IBodyRequestVerifyAdmin,
  IParamsRequestVerifyAdmin,
  IQueryRequest,
} from "../../../interfaces/request.interface";
import { CreateAdminDTO } from "../dto/admin.dto";
import { StatusCodes } from "http-status-codes";
import AdminService from "../services/admin.service";
import {
  errorResponse,
  successResponse,
} from "../../../helpers/response.helper";
import { Prisma } from "@prisma/client";
import getPrismaRequestError from "../../../helpers/getPrismaRequestError.helper";
import { GetAdminsByRoleDTO } from "../dto/get-admins.dto";
import DishController from "./dish.admin.controller";
import { GetAdminListQueryDTO } from "../dto/get-admin-query.dto";
import { IPayloadAuthTokenAdmin } from "../../../interfaces/token.interfaces";
import { GetAdminParamsDTO } from "../dto/get-admin-params.dto";
import AdminAuthController from "./adminAuth.controller";
import { IUpdateRolesAdminDTO } from "../dto/update-admin.dto";

class AdminController {
  private adminService: AdminService;
  readonly DishController: DishController;
  readonly AdminAuthController: AdminAuthController;

  constructor() {
    this.adminService = new AdminService();
    this.DishController = new DishController();
    this.AdminAuthController = new AdminAuthController();
  }

  createAdmin = async (
    req: IBodyRequest<CreateAdminDTO, keyof CreateAdminDTO>,
    res: Response
  ) => {
    try {
      const admin = await this.adminService.createAdmin(req.body);
      res.send(successResponse(admin, "Create Admin Successfully"));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error);

        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(
            errorResponse(
              StatusCodes.BAD_REQUEST,
              getPrismaRequestError(error.code, error.meta?.target as any)
            )
          );
      }

      res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
    }
  };

  createGenders = async (req: Request, res: Response) => {
    try {
      const news = await this.adminService.createGenders();
      res.send(successResponse(news, "success"));
    } catch (error) {
      console.log(error);
    }
  };

  createManyNews = async (req: Request, res: Response) => {
    try {
      const news = await this.adminService.createManyNews();
      res.send(successResponse(news, "success"));
    } catch (error) {
      console.log(error);
    }
  };

  updateRolesAdmin = async (
    req: IBodyRequestVerifyAdmin<
      IUpdateRolesAdminDTO,
      keyof IUpdateRolesAdminDTO,
      IPayloadAuthTokenAdmin
    >,
    res: Response
  ) => {
    try {
      const admin = await this.adminService.updateRolesAdmin({
        ...req.body,
        modifiedByAdminId: req.admin!.adminId,
      });
      res.send(successResponse(admin, "success"));
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send("Bad request");
      console.log(error);
    }
  };

  getRoles = async (req: Request, res: Response) => {
    try {
      const data = await this.adminService.getRoles();
      res.send(successResponse(data, "Success"));
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
    }
  };

  getAdminList = async (
    req: IQueryRequest<GetAdminListQueryDTO>,
    res: Response
  ) => {
    try {
      const data = await this.adminService.getAdminList(req.query);

      res.send(successResponse(data, "Success"));
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
    }
  };

  getAdminById = async (
    req: IParamsRequestVerifyAdmin<GetAdminParamsDTO, IPayloadAuthTokenAdmin>,
    res: Response
  ) => {
    try {
      if (!req.admin?.adminId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(
            errorResponse(StatusCodes.UNAUTHORIZED, "You are not authorized")
          );
      }

      const data = await this.adminService.getAdminById(
        req.params.id,
        req.admin.adminId
      );
      res.send(successResponse(data, "Success"));
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.FORBIDDEN).send("Forbidden");
    }
  };
}

export default AdminController;
