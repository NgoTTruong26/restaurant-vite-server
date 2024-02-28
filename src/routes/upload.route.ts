import Verify from '../middlewares/verify.middleware';
import UploadController from '../modules/upload/upload.controller';
import BaseRoute from './base.route';

class UploadRoute extends BaseRoute {
  private uploadController: UploadController;
  private verify: Verify;

  constructor() {
    super();
    this.uploadController = new UploadController();
    this.verify = new Verify();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post(
      '/image',
      /* this.verify.verifyAccessToken, */
      this.uploadController.uploadImage,
    );
  }
}

export default UploadRoute;
