import { Request, Response } from "express";
import { IBodyRequest } from "../../interfaces/request.interfaces";
import * as authController from "./auth.service";
import { signInDTO } from "./dto/sign-in.dto";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../../helpers/response.helper";
import * as tokenService from "../../services/token.service";
import { SignUpDTO } from "./dto/sign-up.dto";

class AuthController {
  signIn = async (
    req: IBodyRequest<signInDTO, keyof signInDTO>,
    res: Response
  ) => {
    const user = await authController.signIn(req.body);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "User not found"));
    }

    const { accessToken, refreshToken } = tokenService.generateAuthTokens(user);

    res.cookie(process.env.REFRESH_TOKEN!, refreshToken, {
      httpOnly: true,
      secure: false, // lúc deploy thì để true
      sameSite: "strict",
    });

    res.send(successResponse({ ...user, accessToken }, "Sign In successfully"));
  };

  signUp = async (
    req: IBodyRequest<SignUpDTO, keyof SignUpDTO>,
    res: Response
  ) => {
    const user = await authController.signUp(req.body);

    res.send(successResponse(user, "Sign Up successfully"));
  };

  profile = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.send(successResponse<null>(null, ""));
    }

    const userId = tokenService.decodeToken(token!);

    if (!userId) return res.send(successResponse<null>(null, ""));

    const user = await authController.getProfile(userId as string);

    if (!user) return res.send(successResponse<null>(null, ""));

    res.send(successResponse(user, ""));
  };
}

export default AuthController;
