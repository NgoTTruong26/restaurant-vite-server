export class GetNewsDTO {
  id: string;
  title: string;
  srcImg: string;
  introduce?: string | null;
  content: string;
  createdAt: Date;
}

export class GetNewsListDTO {
  newsList: GetNewsDTO[];
  nextPage: number | null;
}
