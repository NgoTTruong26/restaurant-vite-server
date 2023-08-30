import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { IHeadersAdminAuthRequest } from "./headers.interface";

export interface IBodyRequest<T, K extends keyof T>
  extends Omit<Request, "body"> {
  body: Pick<T, K>;
}

export interface IBodyRequestVerifyAdmin<T, K extends keyof T, R>
  extends Omit<Request, "body"> {
  body: Pick<T, K>;
  admin?: R;
}

export interface IParamsRequestVerifyAdmin<T, R> extends Omit<Request, "body"> {
  params: T & ParamsDictionary;
  admin?: R;
}

export interface IBodyRequestVerifyCheckUser<B, T>
  extends Omit<IAuthRequest<T>, "body"> {
  body: B;
}

export interface IParamsRequest<T> extends Request {
  params: T & ParamsDictionary;
}

export interface IQueryRequest<T> extends Request {
  query: T & ParamsDictionary;
}

export interface IRefreshTokenRequest<T, R> extends Omit<Request, "cookies"> {
  cookies: T;
  user?: R;
  err_jwt_exp?: string;
}

export interface IAuthRequest<T> extends Request {
  user?: T;
}

export interface IAdminAuthRequest<T> extends Request {
  headers: IHeadersAdminAuthRequest;
  admin?: T;
}
