import validate from '../middlewares/validate.middleware';
import Verify from '../middlewares/verify.middleware';
import UserController from '../modules/user/user.controller';
import UserValidation from '../validations/user.validation';
import BaseRoute from './base.route';

class UserRoute extends BaseRoute {
  private userController: UserController;
  private userValidation: UserValidation;
  private verify: Verify;

  constructor() {
    super();
    this.userController = new UserController();
    this.userValidation = new UserValidation();
    this.verify = new Verify();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router
      .get(
        '/profile',
        this.verify.verifyAccessTokenCheckAuth,
        this.userController.profile,
      )
      .get('/genders', this.userController.getGenders)
      .get('/users', this.userController.getUsers)
      .post(
        '/users',
        validate(this.userValidation.createUser),
        this.userController.createUser,
      )
      .get('/users/:userId', this.userController.getUser)
      .put(
        '/users/update-profile',
        validate(this.userValidation.updateUser),
        this.userController.updateProfileUser,
      )
      .put(
        '/users/change-password',
        validate(this.userValidation.updateUser),
        this.userController.changePassword,
      )
      .delete(
        '/users',
        validate(this.userValidation.deleteUser),
        this.userController.deleteUser,
      );
  }
}

export default UserRoute;
