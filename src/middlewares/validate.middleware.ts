import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../helpers/response.helper";

function validate(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.body);

    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, error.message));
    }

    return next();
  };
}
export default validate;
