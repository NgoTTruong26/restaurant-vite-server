import { StatusCodes } from "http-status-codes";
import { IBodyResponse } from "../interfaces/response.interface";

export function successResponse<T>(
  data: T,
  message = "Success",
  status = StatusCodes.OK
): IBodyResponse<T> {
  return {
    status,
    message,
    data,
  };
}

export function errorResponse(
  status = StatusCodes.BAD_GATEWAY,
  message = "Bad request"
): IBodyResponse<null> {
  return {
    status,
    message,
  };
}
