import { Request, Response } from "express";
import { IBodyRequest } from "../../../interfaces/request.interfaces";
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

class AdminController {
  private adminService: AdminService;
  readonly DishController: DishController;

  constructor() {
    this.adminService = new AdminService();
    this.DishController = new DishController();
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

  getAdminByRole = async (
    req: IBodyRequest<GetAdminsByRoleDTO, keyof GetAdminsByRoleDTO>,
    res: Response
  ) => {
    try {
      const data = await this.adminService.getAdminByRole(req.body);
      res.send(data);
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
    }
  };
}

export default AdminController;
