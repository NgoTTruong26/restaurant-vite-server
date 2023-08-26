export class GetRoleDTO {
  id: string;
  position: string;
}

export class GetRoleListDTO {
  roles: GetRoleDTO[];
  total: number;
  totalAdmin: number;
}
