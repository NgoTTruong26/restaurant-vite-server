import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import getPrismaRequestError from '../../helpers/getPrismaRequestError.helper';
import { errorResponse, successResponse } from '../../helpers/response.helper';
import {
  IAuthRequest,
  IBodyRequest,
  IQueryRequest,
} from '../../interfaces/request.interface';
import { IPayloadAuthToken } from '../../interfaces/token.interfaces';
import { GetBookingQueryDTO } from '../auth/dto/get-booking-auth.dto';
import BookingService from './booking.service';
import { CreateBookingDTO } from './dto/booking.dto';
import { GetOneBookingDTO } from './dto/get-booking-query.dto';

class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  getBookings = async (
    req: IAuthRequest<IPayloadAuthToken, any, GetBookingQueryDTO>,
    res: Response,
  ) => {
    if (!req.user?.userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(
          errorResponse(StatusCodes.UNAUTHORIZED, 'You are not authorized'),
        );
    }
    try {
      const bookings = await this.bookingService.getBookings(
        req.user.userId,
        parseInt(req.query.take),
        parseInt(req.query.page),
        req.query.status,
      );

      return res.send(successResponse(bookings, 'Successfully'));
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, 'Bad request'));
    }
  };

  getChildrenCategory = async (req: Request, res: Response) => {
    const childrenCategory = await this.bookingService.getChildrenCategory();

    res.send(successResponse(childrenCategory, 'success'));
  };

  getOneBooking = async (
    req: IQueryRequest<GetOneBookingDTO>,
    res: Response,
  ) => {
    const booking = await this.bookingService.getOneBooking(req.query);

    if (!booking) {
      res.send(successResponse(null, 'success'));
      return;
    }
    const allBookingStatus = await this.bookingService.getBookingStatus();

    res.send(successResponse({ ...booking, allBookingStatus }, 'success'));
  };

  createBooking = async (
    req: IBodyRequest<CreateBookingDTO, keyof CreateBookingDTO>,
    res: Response,
  ) => {
    try {
      const booking = await this.bookingService.createBooking(req.body);

      res.send(successResponse(booking, 'Created success'));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error);

        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(
            errorResponse(
              StatusCodes.BAD_REQUEST,
              getPrismaRequestError(error.code, error.meta?.field_name as any),
            ),
          );
      }
      console.log(error);
      res
        .status(StatusCodes.BAD_REQUEST)
        .send(errorResponse(StatusCodes.BAD_REQUEST, 'Bad request'));
    }
  };

  getBookingStatus = async (req: Request, res: Response) => {
    try {
      const bookingStatus = await this.bookingService.getBookingStatus();
      res.send(successResponse(bookingStatus, 'Success'));
    } catch (error) {
      console.log(error);
    }
  };
}

export default BookingController;
