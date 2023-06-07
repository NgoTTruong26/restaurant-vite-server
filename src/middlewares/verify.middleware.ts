import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../helpers/response.helper";
import { IAuthToken } from "../interfaces/token.interfaces";
import jwt from "jsonwebtoken";
import { IAuthRequest } from "../interfaces/request.interfaces";
import { StatusCodes } from "http-status-codes";

class Verify {
  verifyToken(
    req: IAuthRequest<IAuthToken>,
    res: Response,
    next: NextFunction
  ) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "You are not authorized"));

    jwt.verify(token, process.env.JWT_SECRET!, (err, decode) => {
      if (err) {
        console.log(err);

        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(errorResponse(StatusCodes.BAD_REQUEST, "Token is not valid"));
      }

      if (!(decode as IAuthToken).userId)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(errorResponse(StatusCodes.BAD_REQUEST, "Token is not valid"));

      req.user = decode as IAuthToken;

      next();
    });
  }

  verifyAdmin(
    req: IAuthRequest<IAuthToken>,
    res: Response,
    next: NextFunction
  ) {
    this.verifyToken(req, res, () => {
      console.log(req.user);
    });
  }
}

export default Verify;
