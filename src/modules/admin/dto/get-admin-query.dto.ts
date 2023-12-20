export class GetAdminListRequest {
  page: string;
  role: string[];
  search?: string;
}

export class GetTotalAdminListQueryDTO {
  page?: string;
  limit?: number;
  role?: string;
  search?: string;
}
