export class UpdateProfileDTO {
  id: string;
  lastname?: string;
  firstname?: string;
  dateBirth?: string;
  gender?: string;
  nationality?: string;
}

export class DataUpdate {
  lastName?: string;
  firstName?: string;
  dateBirth?: Date;
  gender?: {
    connect: {
      gender: string;
    };
  };
  nationality?: string;
}

export class ChangePasswordDTO {
  id: string;
  password: string;
  newPassword: string;
}
