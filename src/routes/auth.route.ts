import validate from '../middlewares/validate.middleware';
import Verify from '../middlewares/verify.middleware';
import AuthController from '../modules/auth/auth.controller';
import AuthValidation from '../validations/auth.validation';
import BaseRoute from './base.route';

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
        '/profile',
        this.verify.verifyAccessTokenCheckAuth,
        this.authController.profile,
      )
      .get(
        '/get-bookings-table',
        this.verify.verifyAccessToken,
        this.authController.getBookings,
      )
      .post(
        '/check-auth',
        this.verify.verifyAccessTokenCheckAuth,
        this.authController.getProfileCheckAuth,
      )
      .post(
        '/sign-in',
        validate(this.authValidation.signIn),
        this.authController.signIn,
      )
      .post(
        '/sign-up',
        validate(this.authValidation.signIn),
        this.authController.signUp,
      )

      .post(
        '/refresh-token',
        this.verify.verifyRefreshToken,
        this.authController.refreshToken,
      );
  }
}

export default new AuthRoute();
