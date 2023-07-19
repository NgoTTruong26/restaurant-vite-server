import { Request, Response } from "express";
import NewsService from "./news.service";
import { successResponse } from "../../helpers/response.helper";

class NewsController {
  private newsService: NewsService;

  constructor() {
    this.newsService = new NewsService();
  }

  getNewsPreview = async (req: Request, res: Response) => {
    const newsPreview = await this.newsService.getNewsPreview();

    res.send(successResponse(newsPreview, "success"));
  };
}

export default NewsController;
