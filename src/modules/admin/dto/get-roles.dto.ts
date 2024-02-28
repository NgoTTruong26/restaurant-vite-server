export class GetRoleListRequest {
  page: string;
  limit: string;
  search?: string;
}

export class GetRoleDTO {
  id: string;
  position: string;
}

export class GetRoleListDTO {
  roles: GetRoleDTO[];
  total: number;
  page: number;
  previousPage: number | null;
  nextPage: number | null;
  totalPages: number;
}
