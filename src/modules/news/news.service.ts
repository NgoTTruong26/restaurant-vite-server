import { PrismaClient } from "@prisma/client";
import prismaClient from "../../configs/prisma.config";
import { GetNewsDTO, GetNewsListDTO } from "./dto/get-news.dto";
import { GetLatestNewsDTO, GetNewsQueryDTO } from "./dto/get-news-query";
import { GetPostDTO } from "./dto/get-post-params.dto";

class NewsService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  getNewsPreview = async (): Promise<GetNewsDTO[]> => {
    const newsPreview = await this.prisma.news.findMany({
      take: 4,
      select: {
        id: true,
        srcImg: true,
        title: true,
        introduce: true,
        content: true,
        createdAt: true,
      },
    });

    return newsPreview;
  };

  getNewsList = async (
    query: GetNewsQueryDTO
  ): Promise<GetNewsListDTO | null> => {
    try {
      const newsList = await this.prisma.news.findMany({
        skip: parseInt(query.offset || "0"),
        take: parseInt(query.limit || "0"),
        select: {
          id: true,
          srcImg: true,
          title: true,
          introduce: true,
          content: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const _count = await this.prisma.news.count();

      console.log(await this.prisma.news.count());

      return {
        newsList,
        nextPage:
          _count > parseInt(query.offset) + parseInt(query.limit)
            ? parseInt(query.offset) + parseInt(query.limit)
            : null,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getLatestNewsList = async (
    query: GetLatestNewsDTO
  ): Promise<GetNewsDTO[] | null> => {
    try {
      const post = await this.prisma.news.findMany({
        where: {
          NOT: {
            id: query.idPost,
          },
        },
        take: parseInt(query.limit || "0"),
        select: {
          id: true,
          srcImg: true,
          title: true,
          introduce: true,
          content: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return post;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getPost = async (params: GetPostDTO): Promise<GetNewsDTO | null> => {
    try {
      const post = await this.prisma.news.findUnique({
        where: {
          id: params.id,
        },
        select: {
          id: true,
          srcImg: true,
          title: true,
          introduce: true,
          content: true,
          createdAt: true,
        },
      });

      return post;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

export default NewsService;
