import { CreateUserDTO } from "./create-user.dto";

export interface UpdateUserDTO extends Omit<CreateUserDTO, "username"> {
  id: string;
}
