import { JwtPayload } from "jsonwebtoken";

export interface IAuthDecodeToken extends JwtPayload {
  userId: string;
}

export interface payloadAuthToken {
  userId: string;
}
