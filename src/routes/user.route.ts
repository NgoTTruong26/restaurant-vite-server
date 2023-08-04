import validate from "../middlewares/validate.middleware";
import UserController from "../modules/user/user.controller";
import UserValidation from "../validations/user.validation";
import BaseRoute from "./base.route";

class UserRoute extends BaseRoute {
  private userController: UserController;
  private userValidation: UserValidation;

  constructor() {
    super();
    this.userController = new UserController();
    this.userValidation = new UserValidation();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router
      .get("/users", this.userController.getUsers)
      .get("/users/:userId", this.userController.getUser)
      .post(
        "/users",
        validate(this.userValidation.createUser.body),
        this.userController.createUser
      )
      .put(
        "/users",
        validate(this.userValidation.updateUser.body),
        this.userController.updateUser
      )
      .delete(
        "/users",
        validate(this.userValidation.deleteUser.body),
        this.userController.deleteUser
      );
  }
}

export default new UserRoute();
