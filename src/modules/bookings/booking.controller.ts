import { Request, Response } from "express";
import BookingService from "./booking.service";
import { errorResponse, successResponse } from "../../helpers/response.helper";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import getPrismaRequestError from "../../helpers/getPrismaRequestError.helper";
import {
  IBodyRequest,
  IQueryRequest,
} from "../../interfaces/request.interfaces";
import { CreateBookingDTO } from "./dto/booking.dto";
import { GetOneBookingDTO } from "./dto/get-booking-query.dto";

class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  getChildrenCategory = async (req: Request, res: Response) => {
    const childrenCategory = await this.bookingService.getChildrenCategory();

    res.send(successResponse(childrenCategory, "success"));
  };

  getOneBooking = async (
    req: IQueryRequest<GetOneBookingDTO>,
    res: Response
  ) => {
    const allBookingStatus = await this.bookingService.getBookingStatus();

    const booking = await this.bookingService.getOneBooking(req.query);

    res.send(successResponse({ ...booking, allBookingStatus }, "success"));
  };

  createBooking = async (
    req: IBodyRequest<CreateBookingDTO, keyof CreateBookingDTO>,
    res: Response
  ) => {
    try {
      await this.bookingService.createBooking(req.body);

      res.send(successResponse(null, "Created success"));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error);

        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(
            errorResponse(
              StatusCodes.BAD_REQUEST,
              getPrismaRequestError(error.code, error.meta?.field_name as any)
            )
          );
      }
      console.log(error);
    }
  };

  getBookingStatus = async (req: Request, res: Response) => {
    try {
      const bookingStatus = await this.bookingService.getBookingStatus();
      res.send(successResponse(bookingStatus, "Success"));
    } catch (error) {
      console.log(error);
    }
  };

  createBookingStatus = async (req: Request, res: Response) => {
    try {
      const bookingStatus = await this.bookingService.createBookingStatus();
      res.send(successResponse(bookingStatus, "Success"));
    } catch (error) {
      console.log(error);
    }
  };
}

export default BookingController;
