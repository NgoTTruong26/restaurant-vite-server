import { EBookingStatus } from '@prisma/client';
import prismaClient from '../../configs/prisma.config';
import {
  CreateBookingDTO,
  GetBookingDTO,
  GetBookingListResponse,
} from './dto/booking.dto';
import { GetOneBookingDTO } from './dto/get-booking-query.dto';
import { GetBookingStatusDTO } from './dto/get-booking-status.dto';
import { GetChildrenCategoryDTO } from './dto/get-children-category.dto';

class BookingService {
  constructor(private prisma = prismaClient) {}

  getBookings = async (
    userId: string,
    take: number = 5,
    page: number,
    status?: EBookingStatus,
  ): Promise<GetBookingListResponse> => {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where: {
          user: {
            id: userId,
          },
          bookingStatus: {
            name: status,
          },
        },
        take,
        skip: (page - 1) * take,
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
          cancellation: true,
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.booking.count({
        where: {
          user: {
            id: userId,
          },
          bookingStatus: {
            name: status,
          },
        },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        take,
        total,
      },
    };
  };

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
    query: GetOneBookingDTO,
  ): Promise<GetBookingDTO | null> => {
    if (!query.get_booking) {
      return null;
    }

    const phoneNumberPattern = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    const booking = (
      await this.prisma.booking.findMany({
        where: phoneNumberPattern.test(query.get_booking || '')
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
          cancellation: true,
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    )[0];

    return booking;
  };

  createBooking = async (data: CreateBookingDTO): Promise<GetBookingDTO> => {
    const { bookingsForChildren, userId, ...otherData } = data;

    const buffetMenu = await this.prisma.buffetMenu.findUnique({
      where: {
        id: otherData.buffetMenu,
      },
    });

    if (!buffetMenu) throw new Error();

    const total = bookingsForChildren.reduce((prevs: number, curr) => {
      return (
        prevs + ((100 - curr.deals) / 100) * buffetMenu.price * curr.quantity
      );
    }, buffetMenu.price * otherData.numberPeople);

    if (!userId) {
      const booking = await this.prisma.booking.create({
        data: {
          ...otherData,
          buffetMenu: {
            connect: {
              id: otherData.buffetMenu,
            },
          },
          bookingsForChildren: {
            create: bookingsForChildren.reduce(
              (
                prevs: { quantity: number; childrenCategoryId: string }[],
                curr,
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
              [],
            ),
          },
          bookingStatus: {
            connect: {
              step: 2,
            },
          },
          invoicePrice: {
            create: {
              price: total,
              VAT: {
                connect: {
                  tax: 5,
                },
              },
            },
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
          cancellation: true,
          user: {
            select: {
              id: true,

              fullName: true,
            },
          },
        },
      });
      return booking;
    }

    const booking = await this.prisma.booking.create({
      data: {
        ...otherData,
        buffetMenu: {
          connect: {
            id: otherData.buffetMenu,
          },
        },
        bookingsForChildren: {
          create: bookingsForChildren.reduce(
            (
              prevs: { quantity: number; childrenCategoryId: string }[],
              curr,
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
            [],
          ),
        },
        bookingStatus: {
          connect: {
            step: 2,
          },
        },
        invoicePrice: {
          create: {
            price: total,
            VAT: {
              connect: {
                tax: 5,
              },
            },
          },
        },
        user: {
          connect: {
            id: userId,
          },
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
        cancellation: true,
        user: {
          select: {
            id: true,

            fullName: true,
          },
        },
      },
    });

    return booking;
  };

  getBookingStatus = async (): Promise<GetBookingStatusDTO[]> => {
    const bookingStatus = await this.prisma.bookingStatus.findMany({
      select: {
        id: true,
        name: true,
        step: true,
      },
      orderBy: {
        step: 'asc',
      },
    });
    return bookingStatus;
  };
}

export default BookingService;
