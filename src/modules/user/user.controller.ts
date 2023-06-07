import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../../helpers/response.helper";
import {
  IBodyRequest,
  IParamsRequest,
} from "../../interfaces/request.interfaces";
import * as userService from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { DeleteUserDTO } from "./dto/delete-user.dto";

class UserController {
  getUsers = async (req: Request, res: Response) => {
    const users = await userService.getUsers();
    res.status(StatusCodes.OK).send(users);
  };

  getUser = async (req: IParamsRequest<{ userId: string }>, res: Response) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "User not found"));
    }
    res.send(successResponse(user));
  };

  createUser = async (
    req: IBodyRequest<CreateUserDTO, keyof CreateUserDTO>,
    res: Response
  ) => {
    const user = await userService.createUser(req.body);
    res.send(successResponse(user, "Created successfully"));
  };

  updateUser = async (
    req: IBodyRequest<UpdateUserDTO, keyof UpdateUserDTO>,
    res: Response
  ) => {
    const data = await userService.updateUser(req.body);
    if (!data) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "User not found"));
    }
    const user = data;
    res.send(successResponse(user, "Created successfully"));
  };

  deleteUser = async (
    req: IBodyRequest<DeleteUserDTO, keyof DeleteUserDTO>,
    res: Response
  ) => {
    const user = await userService.deleteUser(req.body);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "User not found"));
    }
    res.send(successResponse({ id: user.id }, "Deleted successfully"));
  };
}

export default UserController;
