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
      .get(
        "/profile",
        this.verify.verifyAccessTokenCheckAuth,
        this.authController.profile
      )
      .get(
        "/get-bookings-table",
        this.verify.verifyAccessToken,
        this.authController.getBookings
      )
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

      .post(
        "/refresh-token",
        this.verify.verifyRefreshToken,
        this.authController.refreshToken
      );
  }
}

export default new AuthRoute();
