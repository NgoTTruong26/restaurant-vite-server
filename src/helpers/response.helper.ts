import { StatusCodes } from "http-status-codes";
import { IBodyResponse } from "../interfaces/response.interface";

export function successResponse<T>(
  data: T,
  message = "Success"
): IBodyResponse<T> {
  return {
    status: StatusCodes.OK,
    message,
    data,
  };
}

export function errorResponse(
  status = StatusCodes.BAD_GATEWAY,
  message = "Success"
): IBodyResponse<null> {
  return {
    status,
    message,
  };
}
