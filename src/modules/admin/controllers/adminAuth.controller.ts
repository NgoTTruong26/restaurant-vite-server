import * as tokenService from "../../../services/token.service";

import { IBodyRequest } from "../../../interfaces/request.interfaces";
import { signInDTO } from "../../auth/dto/sign-in.dto";
import AdminAuthService from "../services/adminAuth.service";
import { Response } from "express";
import {
  errorResponse,
  successResponse,
} from "../../../helpers/response.helper";
import { StatusCodes } from "http-status-codes";

class AdminAuthController {
  private AdminAuthService: AdminAuthService;
  constructor() {
    this.AdminAuthService = new AdminAuthService();
  }

  signIn = async (
    req: IBodyRequest<signInDTO, keyof signInDTO>,
    res: Response
  ) => {
    try {
      const admin = await this.AdminAuthService.signIn(req.body);

      const { accessToken, refreshToken } =
        await tokenService.generateAdminAuthTokens(admin);

      res.cookie(process.env.REFRESH_TOKEN!, refreshToken, {
        httpOnly: false,
        secure: false, // lúc deploy thì để true
        sameSite: "strict",
      });

      res.send(
        successResponse({ ...admin, accessToken }, "Sign In successfully")
      );
    } catch (error) {
      console.log(error);

      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, "User not found"));
    }
  };
}

export default AdminAuthController;
