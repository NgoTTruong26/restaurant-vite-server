export class IArrayRoleDTO {
  roleId: string;
  position: string;
}

export class CreateAdminDTO {
  username: string;
  password: string;
  repeat_password: string;
  fullName: string;
  dateBirth?: Date;
  gender?: string;
  roles?: IArrayRoleDTO[];
  nationality?: string;
  phoneNumber?: string;
  email?: string;
}
