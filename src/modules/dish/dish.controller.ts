import { Request, Response } from "express";
import DishService from "./dish.service";
import { successResponse } from "../../helpers/response.helper";
import { IQueryRequest } from "../../interfaces/request.interfaces";
import {
  GetBuffetMenuQueryDTO,
  GetDishesQueryDTO,
  GetSetDishQueryDTO,
} from "./dto/get-dishes-params.dto";

class DishController {
  private dishService: DishService;

  constructor() {
    this.dishService = new DishService();
  }

  getBuffetMenu = async (
    req: IQueryRequest<GetBuffetMenuQueryDTO>,
    res: Response
  ) => {
    const buffetMenu = await this.dishService.getBuffetMenu(req.query);

    res.send(successResponse(buffetMenu, "success"));
  };

  getDishPreview = async (
    req: IQueryRequest<GetSetDishQueryDTO>,
    res: Response
  ) => {
    const data = await this.dishService.getDishPreview(req.query);
    res.send(successResponse(data, "success"));
  };

  getDishes = async (req: IQueryRequest<GetDishesQueryDTO>, res: Response) => {
    const data = await this.dishService.getDishes(req.query);
    res.send(successResponse(data, "success"));
  };
}

export default DishController;
