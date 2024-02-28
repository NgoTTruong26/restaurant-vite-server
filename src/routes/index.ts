import express from 'express';
import adminRoute from './admin.route';
import authRoute from './auth.route';
import BookingRoute from './booking.route';
import dishRouter from './dish.router';
import NewsRoute from './news.route';
import UploadRoute from './upload.route';
import UserRoute from './user.route';

interface IRoute {
  path: string;
  route: express.Router;
}

const router = express.Router();

const userRoute = new UserRoute();

const newsRoute = new NewsRoute();

const bookingRoute = new BookingRoute();

const uploadRoute = new UploadRoute();

const routes: IRoute[] = [
  {
    path: '/',
    route: userRoute.router,
  },
  {
    path: '/auth',
    route: authRoute.router,
  },
  {
    path: '/admin',
    route: adminRoute.router,
  },
  {
    path: '/buffet',
    route: dishRouter.router,
  },
  {
    path: '/news',
    route: newsRoute.router,
  },
  {
    path: '/booking-table',
    route: bookingRoute.router,
  },
  { path: '/upload', route: uploadRoute.router },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
