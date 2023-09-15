class IRole {
  roleId: string;
}

export class IUpdateRolesAdminDTO {
  adminId: string;
  roles: IRole[];
  removeRoles?: string[];
}

export class IDataUpdateRolesAdmin {
  adminId: string;
  modifiedByAdminId: string;
  roles: IRole[];
  removeRoles?: string[];
}

export class UpdateProfileAdminDTO {
  id: string;
  fullName?: string;
  dateBirth?: string;
  gender?: string;
  nationality?: string;
}

export class DataUpdateAdmin {
  fullName?: string;
  dateBirth?: Date;
  gender?: {
    connect: {
      id: string;
    };
  };
  nationality?: string;
}

export class ChangePasswordAdminDTO {
  id: string;
  newPassword: string;
}
