import { PrismaClient } from "@prisma/client";
import prismaClient from "../../configs/prisma.config";
import { GetNewsDTO } from "./dto/news.dto";

class NewsService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  getNewsPreview = async (): Promise<GetNewsDTO[] | {}[]> => {
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
}

export default NewsService;
