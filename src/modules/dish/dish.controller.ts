import { Request, Response } from "express";
import DishService from "./dish.service";
import { successResponse } from "../../helpers/response.helper";
import { IQueryRequest } from "../../interfaces/request.interfaces";
import { GetDishesQueryDTO } from "./dto/get-dishes-params.dto";

class DishController {
  private dishService: DishService;

  constructor() {
    this.dishService = new DishService();
  }

  getBuffetMenu = async (req: Request, res: Response) => {
    const buffetMenu = await this.dishService.getBuffetMenu();

    res.send(successResponse(buffetMenu, "success"));
  };

  getDishes = async (req: IQueryRequest<GetDishesQueryDTO>, res: Response) => {
    const data = await this.dishService.getDishes(req.query);
    res.send(successResponse(data, "success"));
  };
}

export default DishController;
