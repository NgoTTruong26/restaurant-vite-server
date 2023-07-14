import express from "express";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import adminRoute from "./admin.route";
import dishRouter from "./dish.router";

interface IRoute {
  path: string;
  route: express.Router;
}

const router = express.Router();

const routes: IRoute[] = [
  {
    path: "/",
    route: userRoute.router,
  },
  {
    path: "/auth",
    route: authRoute.router,
  },
  {
    path: "/admin",
    route: adminRoute.router,
  },
  {
    path: "/buffet",
    route: dishRouter.router,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
