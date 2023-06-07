import validation from "../middlewares/validate.middleware";
import Verify from "../middlewares/verify.middleware";
import AuthController from "../modules/auth/auth.controller";
import UserController from "../modules/user/user.controller";
import userValidation from "../validations/user.validation";
import BaseRoute from "./base.route";

class UserRoute extends BaseRoute {
  private userController: UserController;

  constructor() {
    super();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router
      .get("/users", this.userController.getUsers)
      .get("/users/:userId", this.userController.getUser)
      .post(
        "/users",
        validation(userValidation.createUser.body),
        this.userController.createUser
      )
      .put(
        "/users",
        validation(userValidation.updateUser.body),
        this.userController.updateUser
      )
      .delete(
        "/users",
        validation(userValidation.deleteUser.body),
        this.userController.deleteUser
      );
  }
}

export default new UserRoute();
