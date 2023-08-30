import { JwtPayload } from "jsonwebtoken";

export interface IAuthDecodeToken extends JwtPayload {
  userId: string;
}
export interface IAuthDecodeTokenAdmin extends JwtPayload {
  adminId: string;
}

export interface IPayloadAuthToken {
  userId: string;
}

export interface IPayloadAuthTokenAdmin {
  adminId: string;
}
