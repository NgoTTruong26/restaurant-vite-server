import validation from "../middlewares/validate.middleware";
import AuthController from "../modules/auth/auth.controller";
import authValidation from "../validations/auth.validation";
import BaseRoute from "./base.route";

class AuthRoute extends BaseRoute {
  private authController: AuthController;

  constructor() {
    super();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router
      .post(
        "/sign-in",
        validation(authValidation.signIn.body),
        this.authController.signIn
      )
      .post(
        "/sign-up",
        validation(authValidation.signUp.body),
        this.authController.signUp
      )
      .get("/profile", this.authController.profile);
  }
}

export default new AuthRoute();
