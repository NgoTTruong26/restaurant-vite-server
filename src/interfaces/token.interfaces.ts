import { JwtPayload } from "jsonwebtoken";

export interface IAuthDecodeToken extends JwtPayload {
  userId: string;
}

export interface IPayloadAuthToken {
  userId: string;
}
