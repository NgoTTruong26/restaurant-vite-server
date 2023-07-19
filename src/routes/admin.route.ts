import AdminController from "../modules/admin/controllers/admin.controller";
import BaseRoute from "./base.route";

class AdminRoute extends BaseRoute {
  private adminController: AdminController;

  constructor() {
    super();
    this.adminController = new AdminController();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.initializeRoutesAdmin();
    this.initializeRoutesDish();
  }

  initializeRoutesDish(): void {
    this.router
      .post(
        "/create-buffet-menu",
        this.adminController.DishController.createBuffetMenu
      )
      .post(
        "/create-set-dish",
        this.adminController.DishController.createSetDish
      )
      .post("/create-dish", this.adminController.DishController.createDish)
      .put(
        "/connect-buffet-menu-with-set-dish",
        this.adminController.DishController.connectBuffetMenuWithSetDish
      )
      .put(
        "/connect-set-dish-with-dish",
        this.adminController.DishController.connectSetDishWithDish
      )
      .put(
        "/disconnect-buffet-menu-with-set-dish",
        this.adminController.DishController.disconnectBuffetMenuWithSetDish
      );
  }

  initializeRoutesAdmin(): void {
    this.router
      .post("/", this.adminController.createAdmin)
      .post("/create-many-news", this.adminController.createManyNews)
      .get("/get-admin-by-roles", this.adminController.getAdminByRole);
  }
}

export default new AdminRoute();
