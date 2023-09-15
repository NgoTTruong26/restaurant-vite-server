import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../../helpers/response.helper";
import {
  IBodyRequest,
  IParamsRequest,
} from "../../interfaces/request.interface";
import { CreateUserDTO } from "./dto/create-user.dto";
import { ChangePasswordDTO, UpdateProfileDTO } from "./dto/update-user.dto";
import { DeleteUserDTO } from "./dto/delete-user.dto";
import { Prisma } from "@prisma/client";
import getPrismaRequestError from "../../helpers/getPrismaRequestError.helper";
import UserService from "./user.service";

class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  getGenders = async (req: Request, res: Response) => {
    const genders = await this.userService.getGenders();
    res.send(successResponse(genders, "Success"));
  };

  getUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getUsers();
    res.status(StatusCodes.OK).send(users);
  };

  getUser = async (req: IParamsRequest<{ userId: string }>, res: Response) => {
    try {
      const user = await this.userService.getUserById(req.params.userId);
      res.send(successResponse(user));
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "User not found"));
    }
  };

  createUser = async (
    req: IBodyRequest<CreateUserDTO, keyof CreateUserDTO>,
    res: Response
  ) => {
    try {
      const user = await this.userService.createUser(req.body);
      res.send(successResponse(user, "Created successfully"));
    } catch (error) {
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
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "Bad request"));
    }
  };

  updateProfileUser = async (
    req: IBodyRequest<UpdateProfileDTO, keyof UpdateProfileDTO>,
    res: Response
  ) => {
    try {
      const user = await this.userService.updateProfileUser(req.body);

      res.send(successResponse(user, "Updated successfully"));
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
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "User not found"));
    }
  };
  updateSecurityUser = async (
    req: IBodyRequest<UpdateProfileDTO, keyof UpdateProfileDTO>,
    res: Response
  ) => {
    try {
      const user = await this.userService.updateSecurityUser(req.body);
      res.send(successResponse(user, "Updated successfully"));
    } catch (error) {
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
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "User not found"));
    }
  };

  changePassword = async (
    req: IBodyRequest<ChangePasswordDTO, keyof ChangePasswordDTO>,
    res: Response
  ) => {
    try {
      const user = await this.userService.changePassword(req.body);

      res.send(successResponse(user, ""));
    } catch (error) {
      console.log(error);

      res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "Bad Request"));
    }
  };

  deleteUser = async (
    req: IBodyRequest<DeleteUserDTO, keyof DeleteUserDTO>,
    res: Response
  ) => {
    try {
      const user = await this.userService.deleteUser(req.body);

      res.send(successResponse({ id: user.id }, "Deleted successfully"));
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "User not found"));
    }
  };
}

export default UserController;
