import AuthController from "../modules/auth/auth.controller";
import BaseRoute from "./base.route";
import Verify from "../middlewares/verify.middleware";
import AuthValidation from "../validations/auth.validation";
import validate from "../middlewares/validate.middleware";

class AuthRoute extends BaseRoute {
  private authController: AuthController;
  private verify: Verify;
  private authValidation: AuthValidation;

  constructor() {
    super();
    this.authController = new AuthController();
    this.verify = new Verify();
    this.authValidation = new AuthValidation();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router
      .post(
        "/sign-in",
        validate(this.authValidation.signIn.body),
        this.authController.signIn
      )
      .post(
        "/sign-up",
        validate(this.authValidation.signIn.body),
        this.authController.signUp
      )
      .get("/profile", this.verify.verifyToken, this.authController.profile)
      .post("/refresh-token", this.authController.refreshToken);
  }
}

export default new AuthRoute();
