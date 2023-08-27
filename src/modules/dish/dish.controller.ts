import { Request, Response } from "express";
import DishService from "./dish.service";
import { successResponse } from "../../helpers/response.helper";
import {
  IParamsRequest,
  IQueryRequest,
} from "../../interfaces/request.interface";
import {
  GetBuffetMenuQueryDTO,
  GetDishesQueryDTO,
  GetSetDishQueryDTO,
} from "./dto/get-dishes-query.dto";
import { GetBuffetMenuParamsDTO } from "./dto/get-dish-params.dto";

class DishController {
  private dishService: DishService;

  constructor() {
    this.dishService = new DishService();
  }

  getManyBuffetMenu = async (
    req: IQueryRequest<GetBuffetMenuQueryDTO>,
    res: Response
  ) => {
    const buffetMenus = await this.dishService.getManyBuffetMenu(req.query);

    res.send(successResponse(buffetMenus, "success"));
  };

  getBuffetMenu = async (
    req: IParamsRequest<GetBuffetMenuParamsDTO>,
    res: Response
  ) => {
    const buffetMenu = await this.dishService.getBuffetMenu(req.params);

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
