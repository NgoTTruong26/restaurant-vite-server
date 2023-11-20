import validate from '../middlewares/validate.middleware';
import Verify from '../middlewares/verify.middleware';
import AdminController from '../modules/admin/controllers/admin.controller';
import AdminValidation from '../validations/admin.validation';
import BaseRoute from './base.route';

class AdminRoute extends BaseRoute {
  private adminController: AdminController;
  private adminValidation: AdminValidation;
  private verify: Verify;

  constructor() {
    super();
    this.adminController = new AdminController();
    this.adminValidation = new AdminValidation();
    this.verify = new Verify();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.initializeRoutesAdmin();
    this.initializeRoutesDish();
    this.initializeRoutesAuthAdmin();
  }

  initializeRoutesDish(): void {
    this.router
      .post('/create-vat', this.adminController.dishController.createVAT)
      .post(
        '/create-booking-status',
        this.adminController.dishController.createBookingStatus,
      )
      .post(
        '/create-buffet-menu',
        this.adminController.dishController.createBuffetMenu,
      )
      .post(
        '/create-set-dish',
        this.adminController.dishController.createSetDish,
      )
      .post('/create-dish', this.adminController.dishController.createDish)
      .put(
        '/connect-buffet-menu-with-set-dish',
        this.adminController.dishController.connectBuffetMenuWithSetDish,
      )
      .put(
        '/connect-set-dish-with-dish',
        this.adminController.dishController.connectSetDishWithDish,
      )
      .put(
        '/disconnect-buffet-menu-with-set-dish',
        this.adminController.dishController.disconnectBuffetMenuWithSetDish,
      );
  }

  initializeRoutesAdmin(): void {
    this.router

      .post(
        '/create-admin',
        validate(this.adminValidation.createAdmin),
        this.adminController.createAdmin,
      )
      .post('/create-many-news', this.adminController.createManyNews)
      .post('/create-genders', this.adminController.createGenders)

      .post(
        '/refresh-token',
        this.verify.verifyRefreshTokenAdmin,
        this.adminController.adminAuthController.refreshToken,
      )
      .put(
        '/update-profile',
        /* validate(this.userValidation.updateUser.body), */
        this.adminController.updateProfileAdmin,
      )
      .put(
        '/change-password',
        this.verify.verifyAccessTokenAdmin,
        /* validate(this.userValidation.updateUser.body), */
        this.adminController.changePassword,
      )
      .put(
        '/update-roles-admin',
        this.verify.verifyAccessTokenAdmin,
        this.adminController.updateRolesAdmin,
      )
      .get('/admin-list', this.adminController.getAdminList)
      .get('/get-roles', this.adminController.getRoles)
      .get(
        '/get-admin-by-id/:id',
        this.verify.verifyAccessTokenAdmin,
        this.adminController.getAdminById,
      );
  }

  initializeRoutesAuthAdmin(): void {
    this.router
      .post(
        '/auth/check-auth',
        this.verify.verifyAccessTokenAdmin,
        this.adminController.adminAuthController.getProfileCheckAuth,
      )
      .post('/auth/sign-in', this.adminController.adminAuthController.signIn)
      .put(
        '/auth/change-password',
        this.verify.verifyAccessTokenAdmin,
        this.adminController.adminAuthController.changePassword,
      )
      .get(
        '/auth/profile',
        this.verify.verifyAccessTokenAdmin,
        this.adminController.adminAuthController.getProfileAdmin,
      );
  }
}

export default new AdminRoute();
