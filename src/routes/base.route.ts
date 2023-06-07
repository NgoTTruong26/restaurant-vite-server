import express from "express";

abstract class BaseRoute {
  readonly router: express.Router;

  constructor() {
    this.router = express.Router();
  }

  protected abstract initializeRoutes(): void;
}

export default BaseRoute;
