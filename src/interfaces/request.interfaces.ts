import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";

export interface IBodyRequest<T, K extends keyof T>
  extends Omit<Request, "body"> {
  body: Pick<T, K>;
}

export interface IParamsRequest<T> extends Request {
  params: T & ParamsDictionary;
}

export interface IQueryRequest<T> extends Request {
  query: T & ParamsDictionary;
}

export interface ICookiesResponse<T> extends Omit<Request, "cookies"> {
  cookies: T;
}

export interface IAuthRequest<T> extends Request {
  user?: T;
}
