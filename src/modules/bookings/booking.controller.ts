import { Request, Response } from "express";
import BookingService from "./booking.service";
import { errorResponse, successResponse } from "../../helpers/response.helper";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import getPrismaRequestError from "../../helpers/getPrismaRequestError.helper";

class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  getChildrenCategory = async (req: Request, res: Response) => {
    const childrenCategory = await this.bookingService.getChildrenCategory();

    res.send(successResponse(childrenCategory, "success"));
  };

  getOneBooking = async (req: Request, res: Response) => {
    console.log(req.query);

    const booking = await this.bookingService.getOneBooking();

    res.send(successResponse(booking, "success"));
  };

  createBooking = async (req: Request, res: Response) => {
    try {
      const booking = await this.bookingService.createBooking();

      res.send(successResponse(booking, "success"));
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
}

export default BookingController;
