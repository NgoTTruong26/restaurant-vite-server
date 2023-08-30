export interface IUpdateRolesAdminDTO {
  adminId: string;
  roles: (string | false)[];
  removeRoles?: string[];
}

export interface IDataUpdateRolesAdmin {
  adminId: string;
  modifiedByAdminId: string;
  roles: (string | false)[];
  removeRoles?: string[];
}
