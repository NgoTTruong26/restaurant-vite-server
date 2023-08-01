import DishController from "../modules/dish/dish.controller";
import BaseRoute from "./base.route";

class DishRoute extends BaseRoute {
  private dishController: DishController;

  constructor() {
    super();
    this.dishController = new DishController();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get("/list-buffet-menu", this.dishController.getManyBuffetMenu);
    this.router.get("/buffet-menu/:id", this.dishController.getBuffetMenu);
    this.router.get("/dishes-preview", this.dishController.getDishPreview);
    this.router.get("/dishes", this.dishController.getDishes);
  }
}

export default new DishRoute();
