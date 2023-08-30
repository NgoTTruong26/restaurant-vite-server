import { GetGenderDTO } from "../../user/dto/get-gender.dto";
import { GetRoleDTO } from "./get-roles.dto";

export class GetAdminsByRoleDTO {
  position: string;
}

export class GetAdminDTO {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dateBirth: Date | null;
  gender: GetGenderDTO | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  roles: GetRoleDTO[];
}

export class GetAdminListDTO {
  adminList: GetAdminDTO[];
  page: number;
  previousPage: number | null;
  nextPage: number | null;
  totalPages: number;
}
