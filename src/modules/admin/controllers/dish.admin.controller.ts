import { Request, Response } from "express";
import {
  CreateBuffetMenuDTO,
  CreateDish,
  CreateSetDishDTO,
} from "../dto/dish.dto";
import {
  errorResponse,
  successResponse,
} from "../../../helpers/response.helper";
import { StatusCodes } from "http-status-codes";

import { IBodyRequest } from "../../../interfaces/request.interfaces";
import DishService from "../services/dish.admin.service";
import {
  ConnectDishes,
  DishConnectedDTO,
  SetDishConnectedDTO,
} from "../dto/connect-dish.dto";
import { DisconnectDishes } from "../dto/disconnec-dish.dto";

class DishController {
  private DishService: DishService;
  constructor() {
    this.DishService = new DishService();
  }

  createVAT = async (req: Request, res: Response) => {
    try {
      await this.DishService.createVAT();

      return res.send(successResponse(null, "Create VAT successfully"));
    } catch (error) {
      console.log(error);
    }
  };

  createBuffetMenu = async (
    req: IBodyRequest<CreateBuffetMenuDTO, keyof CreateBuffetMenuDTO>,
    res: Response
  ) => {
    try {
      const buffetMenu = await this.DishService.createBuffetMenu(req.body);

      return res.send(
        successResponse(buffetMenu, "Create Buffet Menu successfully")
      );
    } catch (error) {
      console.log(error);

      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "Bad Request"));
    }
  };

  createSetDish = async (
    req: IBodyRequest<CreateSetDishDTO, keyof CreateSetDishDTO>,
    res: Response
  ) => {
    try {
      const setDish = await this.DishService.createSetDish(req.body);

      return res.send(successResponse(setDish));
    } catch (error) {
      console.log(error);

      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "Bad Request"));
    }
  };

  createDish = async (
    req: IBodyRequest<CreateDish, keyof CreateDish>,
    res: Response
  ) => {
    try {
      const dish = await this.DishService.createDish(req.body);

      return res.send(successResponse(dish));
    } catch (error) {
      console.log(error);

      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "Bad Request"));
    }
  };

  connectBuffetMenuWithSetDish = async (
    req: IBodyRequest<
      ConnectDishes<SetDishConnectedDTO>,
      keyof ConnectDishes<SetDishConnectedDTO>
    >,
    res: Response
  ) => {
    try {
      await this.DishService.connectBuffetMenuWithSetDish(req.body);

      return res.send("Success");
    } catch (error) {
      console.log(error);

      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "Bad Request"));
    }
  };

  connectSetDishWithDish = async (
    req: IBodyRequest<
      ConnectDishes<DishConnectedDTO>,
      keyof ConnectDishes<DishConnectedDTO>
    >,
    res: Response
  ) => {
    try {
      await this.DishService.connectSetDishWithDish(req.body);

      return res.send("Success");
    } catch (error) {
      console.log(error);

      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "Bad Request"));
    }
  };

  disconnectBuffetMenuWithSetDish = async (
    req: IBodyRequest<
      DisconnectDishes<SetDishConnectedDTO>,
      keyof ConnectDishes<DishConnectedDTO>
    >,
    res: Response
  ) => {
    try {
      await this.DishService.disconnectBuffetMenuWithSetDish(req.body);

      return res.send("Success");
    } catch (error) {
      console.log(error);

      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "Bad Request"));
    }
  };
}

export default DishController;
