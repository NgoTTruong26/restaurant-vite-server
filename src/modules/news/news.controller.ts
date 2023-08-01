import { Request, Response } from "express";
import NewsService from "./news.service";
import { successResponse } from "../../helpers/response.helper";
import { GetLatestNewsDTO, GetNewsQueryDTO } from "./dto/get-news-query";
import {
  IParamsRequest,
  IQueryRequest,
} from "../../interfaces/request.interfaces";
import { GetPostDTO } from "./dto/get-post-params.dto";

class NewsController {
  private newsService: NewsService;

  constructor() {
    this.newsService = new NewsService();
  }

  getNewsPreview = async (req: Request, res: Response) => {
    const newsPreview = await this.newsService.getNewsPreview();

    res.send(successResponse(newsPreview, "success"));
  };

  getNewsList = async (req: IQueryRequest<GetNewsQueryDTO>, res: Response) => {
    const newsList = await this.newsService.getNewsList(req.query);

    res.send(successResponse(newsList, "success"));
  };

  getLatestNewsList = async (
    req: IQueryRequest<GetLatestNewsDTO>,
    res: Response
  ) => {
    const newsList = await this.newsService.getLatestNewsList(req.query);

    res.send(successResponse(newsList, "success"));
  };

  getPost = async (req: IParamsRequest<GetPostDTO>, res: Response) => {
    const post = await this.newsService.getPost(req.params);

    res.send(successResponse(post, "success"));
  };
}

export default NewsController;
