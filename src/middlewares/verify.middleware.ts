import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../helpers/response.helper";
import { IAuthDecodeToken } from "../interfaces/token.interfaces";
import jwt from "jsonwebtoken";
import {
  IAuthRequest,
  IBodyRequest,
  IBodyRequestVerifyCheckUser,
  IRefreshTokenRequest,
} from "../interfaces/request.interfaces";
import { StatusCodes } from "http-status-codes";
import { RefreshTokenDTO } from "../modules/auth/dto/refresh-token.dto";
import { CreateBookingDTO } from "../modules/bookings/dto/booking.dto";
import { IPayloadAuthToken } from "../interfaces/token.interfaces";

export enum EJWTError {
  EXPIRED_ERROR = "TokenExpiredError",
}

class Verify {
  verifyAccessToken(
    req: IAuthRequest<IAuthDecodeToken>,
    res: Response,
    next: NextFunction
  ) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(
          errorResponse(StatusCodes.UNAUTHORIZED, "You are not authorized")
        );

    jwt.verify(token, process.env.JWT_SECRET!, (err, decode) => {
      if (err) {
        console.log(err);

        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(errorResponse(StatusCodes.UNAUTHORIZED, "Token is not valid"));
      }

      if (!(decode as IAuthDecodeToken).userId) {
        req.user = undefined;

        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(errorResponse(StatusCodes.UNAUTHORIZED, "Token is not valid"));
      }

      req.user = decode as IAuthDecodeToken;

      next();
    });
  }

  verifyAccessTokenCheckAuth = (
    req: IAuthRequest<IAuthDecodeToken>,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      req.user = undefined;

      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(
          errorResponse(StatusCodes.UNAUTHORIZED, "You are not authorized")
        );
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decode) => {
      if (err) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(errorResponse(StatusCodes.UNAUTHORIZED, "Token is not valid"));
      }

      if (!(decode as IAuthDecodeToken).userId) {
        req.user = undefined;

        return next();
      }

      req.user = decode as IAuthDecodeToken;

      next();
    });

    return;
  };

  verifyRefreshToken = (
    req: IRefreshTokenRequest<RefreshTokenDTO, IAuthDecodeToken>,
    res: Response,
    next: NextFunction
  ) => {
    const refreshToken = req.cookies["refresh_token"];

    if (!refreshToken)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(
          errorResponse(StatusCodes.UNAUTHORIZED, "You are not authorized")
        );

    jwt.verify(refreshToken, process.env.JWT_SECRET!, (err, decode) => {
      if (err) {
        console.log(err);

        if (err.name === EJWTError.EXPIRED_ERROR) {
          req.err_jwt_exp = EJWTError.EXPIRED_ERROR;
          return next();
        }

        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(
            errorResponse(
              StatusCodes.UNAUTHORIZED,
              "Refresh Token is not valid"
            )
          );
      }

      if (!(decode as IAuthDecodeToken).userId)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send(
            errorResponse(
              StatusCodes.UNAUTHORIZED,
              "Refresh Token is not valid"
            )
          );

      req.user = decode as IAuthDecodeToken;

      next();
    });

    return;
  };

  verifyAdmin = (
    req: IAuthRequest<IAuthDecodeToken>,
    res: Response,
    next: NextFunction
  ) => {
    return this.verifyAccessToken(req, res, () => {
      console.log(req.user);
    });
  };

  verifyBooking = (
    req: IBodyRequestVerifyCheckUser<CreateBookingDTO, IPayloadAuthToken>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.body.userId) {
      const checkUser = () => {
        if (req.body.userId === req.user?.userId) {
          return next();
        }

        return res
          .status(StatusCodes.FORBIDDEN)
          .send("You are not allowed to bookings for other people");
      };

      return this.verifyAccessToken(req, res, checkUser);
    }

    next();
  };
}

export default Verify;
