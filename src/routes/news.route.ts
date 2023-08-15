import NewsController from "../modules/news/news.controller";
import BaseRoute from "./base.route";

class NewsRoute extends BaseRoute {
  private newsController: NewsController;

  constructor() {
    super();
    this.newsController = new NewsController();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router
      .get("/", this.newsController.getNewsList)
      .get("/news-preview", this.newsController.getNewsPreview)
      .get("/news-latest", this.newsController.getLatestNewsList)
      .get("/:id", this.newsController.getPost);
  }
}

export default NewsRoute;
