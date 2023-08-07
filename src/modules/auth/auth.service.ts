import { signInDTO } from "./dto/sign-in.dto";
import { SignUpDTO } from "./dto/sign-up.dto";
import { ResponseUserDTO } from "../user/dto/response.dto";
import { compare, encrypt } from "../../helpers/encryption.utils";
import {
  IAuthDecodeToken,
  IPayloadAuthToken,
} from "../../interfaces/token.interfaces";
import { generateAuthRefreshToken } from "../../services/token.service";
import { PrismaClient } from "@prisma/client";
import prismaClient from "../../configs/prisma.config";
import { GetBookingDTO } from "../bookings/dto/booking.dto";

class AuthService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  signIn = async ({
    username,
    reqPassword,
  }: signInDTO): Promise<ResponseUserDTO> => {
    const data = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!data) {
      throw new Error();
    }

    const { password, ...user } = data;

    if (!(await compare(reqPassword, password))) {
      throw new Error();
    }

    return user;
  };

  signUp = async (payload: SignUpDTO): Promise<ResponseUserDTO> => {
    const { reqPassword, repeatPassword, acceptTermsAndServices, ...data } =
      payload;

    const { password, ...user } = await this.prisma.user.create({
      data: {
        ...data,
        password: await encrypt(reqPassword),
      },
    });

    return user;
  };

  getProfile = async (userId?: string): Promise<ResponseUserDTO | null> => {
    if (!userId) {
      return null;
    }

    const data = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!data) {
      return null;
    }
    const { password, ...user } = data;
    return user;
  };

  refreshToken = async (
    payload: IPayloadAuthToken,
    refreshToken: string
  ): Promise<void> => {
    const data = await this.prisma.refreshToken.findMany({
      where: {
        userId: payload.userId,
      },
      select: {
        token: true,
      },
    });

    const refreshTokens = data.map((refreshToken) => refreshToken.token);

    if (!refreshTokens.includes(refreshToken)) {
      throw new Error();
    }
  };

  deleteRefreshToken = async (refreshToken: string) => {
    console.log(refreshToken);

    return await this.prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
  };

  getBookings = async (userId: string): Promise<GetBookingDTO[]> => {
    return await this.prisma.booking.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        phoneNumber: true,
        author: true,
        bookingTime: true,
        bookingDate: true,
        numberPeople: true,
        note: true,
        bookingsForChildren: {
          select: {
            id: true,
            childrenCategory: {
              select: {
                id: true,
                category: true,
                deals: true,
              },
            },
            quantity: true,
          },
        },
        buffetMenu: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            special: true,
          },
        },
        bookingStatus: {
          select: {
            id: true,
            name: true,
            step: true,
          },
        },
        invoicePrice: {
          select: {
            id: true,
            price: true,
            VAT: {
              select: {
                id: true,
                tax: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };
}

export default AuthService;
