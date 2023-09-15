export class UpdateProfileDTO {
  id: string;
  fullName: string;
  dateBirth?: string;
  gender?: string;
  nationality?: string;
}

export class DataUpdate {
  fullName?: string;
  dateBirth?: Date;
  gender?: {
    connect: {
      id: string;
    };
  };
  nationality?: string;
}

export class ChangePasswordDTO {
  id: string;
  password: string;
  newPassword: string;
}
