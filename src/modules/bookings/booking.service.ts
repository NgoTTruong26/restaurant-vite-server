import prismaClient from "../../configs/prisma.config";
import { GetChildrenCategoryDTO } from "./dto/get-children-category.dto";

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

  getOneBooking = async () => {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: {
          id: /* "clkpiv77b0001vvskznsbvuzf" */ /* "clkpj9kej0001vv8srh0kj0vh" */ "clkr9e28s0001vvr4y1r1ozdn",
        },
        include: {
          buffetMenu: true,
          bookingsForChildren: {
            include: {
              childrenCategory: true,
            },
          },
        },
      });

      return booking;
    } catch (error) {
      console.log(error);

      return null;
    }
  };

  createBooking = async () => {
    const booking = await this.prisma.booking.create({
      data: {
        buffetMenuId: "cliydv7hx0001vvhkrgfy01pa",
        phoneNumber: "03899109",
        author: "Ngo Truong",
        bookingTime: "20:20",
        bookingDate: "2/3/2023",
        numberPeople: 5,
        bookingsForChildren: {
          create: false
            ? [
                {
                  quantity: 5,
                  childrenCategoryId: "56122289-2ab6-11ee-8d67-0242ac130002",
                },
              ]
            : [],
        },
      },
    });

    return booking;
  };
}

export default BookingService;
