import { JwtPayload } from "jsonwebtoken";

export interface IAuthToken extends JwtPayload {
  userId: string;
}
