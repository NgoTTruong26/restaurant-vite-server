import { GetRoleDTO } from "./get-roles.dto";

export class GetAdminsByRoleDTO {
  position: string;
}

export class GetAdminDTO {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  roles: {
    role: GetRoleDTO;
  }[];
}

export class GetAdminListDTO {
  adminList: GetAdminDTO[];
  page: number;
  previousPage: number | null;
  nextPage: number | null;
  totalPages: number;
}
