import Verify from "../middlewares/verify.middleware";
import AdminController from "../modules/admin/controllers/admin.controller";
import BaseRoute from "./base.route";

class AdminRoute extends BaseRoute {
  private adminController: AdminController;
  private verify: Verify;

  constructor() {
    super();
    this.adminController = new AdminController();
    this.verify = new Verify();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.initializeRoutesAdmin();
    this.initializeRoutesDish();
  }

  initializeRoutesDish(): void {
    this.router
      .post("/create-vat", this.adminController.DishController.createVAT)
      .post(
        "/create-booking-status",
        this.adminController.DishController.createBookingStatus
      )
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
      .post("/create-genders", this.adminController.createGenders)
      .post("/sign-in", this.adminController.AdminAuthController.signIn)
      .get("/", this.adminController.getAdminList)
      .get(
        "/:id",
        this.verify.verifyAccessToken,
        this.adminController.getAdminById
      )
      .get("/get-roles", this.adminController.getRoles);
  }
}

export default new AdminRoute();
