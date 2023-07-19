import prismaClient from "../../configs/prisma.config";
import {
  GetBuffetMenuQueryDTO,
  GetDishesQueryDTO,
  GetSetDishQueryDTO,
} from "./dto/get-dishes-params.dto";
import {
  GetBuffetMenuDTO,
  GetListDishDTO,
  GetSetDishDTO,
} from "./dto/get-dishes.dto";

class DishService {
  constructor(private prisma = prismaClient) {}

  getBuffetMenu = async (
    query?: GetBuffetMenuQueryDTO
  ): Promise<GetBuffetMenuDTO[]> => {
    const buffetMenu = await this.prisma.buffetMenu.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        special: true,
        setDishes: {
          select: {
            id: true,
            name: true,
            image: true,
            special: true,
            dishes: {
              take: parseInt(query?.limit || "0") || 0,
              select: {
                id: true,
                image: true,
                name: true,
                byNumberOfPeople: true,
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    return buffetMenu;
  };

  getDishPreview = async (
    query?: GetSetDishQueryDTO
  ): Promise<GetSetDishDTO[]> => {
    const setDish = await this.prisma.setDish.findMany({
      where: {
        buffetMenus: {
          some: {
            id: query?.buffet_menu_id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        special: true,
        dishes: {
          take: 4,
          select: {
            id: true,
            image: true,
            name: true,
            byNumberOfPeople: true,
            price: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return setDish;
  };

  getDishes = async (
    query: GetDishesQueryDTO
  ): Promise<GetListDishDTO | undefined> => {
    try {
      const listDishes = await this.prisma.setDish.findUnique({
        where: {
          id: query.set_dish_id,
          buffetMenus: {
            some: {
              id: query?.buffet_menu_id,
            },
          },
        },

        select: {
          dishes: {
            skip: parseInt(query.offset),
            take: parseInt(query.limit),
            select: {
              id: true,
              image: true,
              name: true,
              byNumberOfPeople: true,
              price: true,
            },
          },
          _count: {
            select: {
              dishes: true,
            },
          },
        },
      });

      if (!listDishes) return undefined;

      return {
        ...listDishes,
        nextPage:
          listDishes?._count.dishes! >
          parseInt(query.offset) + parseInt(query.limit)
            ? parseInt(query.offset) + parseInt(query.limit)
            : null,
        idBuffetMenu: query.buffet_menu_id,
        idSetDish: query.set_dish_id,
      };
    } catch (error) {
      console.log(error);
    }
  };
}

export default DishService;
