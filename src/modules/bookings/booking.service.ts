import { Booking } from "@prisma/client";
import prismaClient from "../../configs/prisma.config";
import { CreateBookingDTO, GetBookingDTO } from "./dto/booking.dto";
import { GetChildrenCategoryDTO } from "./dto/get-children-category.dto";
import { GetOneBookingDTO } from "./dto/get-booking-query.dto";
import { GetBookingStatusDTO } from "./dto/get-booking-status.dto";

class BookingService {
  constructor(private prisma = prismaClient) {}

  getChildrenCategory = async (): Promise<GetChildrenCategoryDTO[]> => {
    const childrenCategory = await this.prisma.childrenCategory.findMany({
      select: {
        id: true,
        category: true,
        deals: true,
      },
    });

    return childrenCategory;
  };

  getOneBooking = async (
    query: GetOneBookingDTO
  ): Promise<GetBookingDTO | null> => {
    const phoneNumberPattern = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    const booking = (
      await this.prisma.booking.findMany({
        where: phoneNumberPattern.test(query.get_booking || "")
          ? { phoneNumber: query.get_booking }
          : {
              id: query.get_booking,
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
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    )[0];

    return booking;
  };

  createBooking = async (data: CreateBookingDTO): Promise<void> => {
    const { buffetMenu, bookingsForChildren, ...otherData } = data;

    await this.prisma.booking.create({
      data: {
        ...otherData,
        buffetMenu: {
          connect: {
            id: buffetMenu,
          },
        },
        bookingsForChildren: {
          create: bookingsForChildren.reduce(
            (
              prevs: { quantity: number; childrenCategoryId: string }[],
              curr
            ) => {
              if (curr.quantity > 0) {
                return [
                  ...prevs,
                  {
                    quantity: curr.quantity,
                    childrenCategoryId: curr.childrenCategoryId,
                  },
                ];
              }
              return prevs;
            },
            []
          ),
        },
        bookingStatus: {
          connect: {
            step: 2,
          },
        },
      },
    });
  };

  getBookingStatus = async (): Promise<GetBookingStatusDTO[]> => {
    const bookingStatus = await this.prisma.bookingStatus.findMany({
      select: {
        id: true,
        name: true,
        step: true,
      },
      orderBy: {
        step: "asc",
      },
    });
    return bookingStatus;
  };

  createBookingStatus = async () => {
    await this.prisma.bookingStatus.createMany({
      data: [
        {
          name: "Tạo yêu cầu thành công",
          step: 1,
        },
        {
          name: "Chờ xác nhận",
          step: 2,
        },
        {
          name: "Thành công",
          step: 3,
        },
      ],
    });
  };
}

export default BookingService;
