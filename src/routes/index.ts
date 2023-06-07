import express from "express";
import userRoute from "./user.route";
import authRoute from "./auth.route";

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
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
