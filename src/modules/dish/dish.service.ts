import prismaClient from "../../configs/prisma.config";
import { GetBuffetMenuParamsDTO } from "./dto/get-dish-params.dto";
import {
  GetBuffetMenuQueryDTO,
  GetDishesQueryDTO,
  GetSetDishQueryDTO,
} from "./dto/get-dishes-query.dto";
import {
  GetBuffetMenuDTO,
  GetDishesListDTO,
  GetSetDishDTO,
} from "./dto/get-dishes.dto";

class DishService {
  constructor(private prisma = prismaClient) {}

  getManyBuffetMenu = async (
    query?: GetBuffetMenuQueryDTO
  ): Promise<GetBuffetMenuDTO[] | null> => {
    try {
      const buffetMenu = await this.prisma.buffetMenu.findMany({
        select: {
          id: true,
          name: true,
          price: true,
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
    } catch (error) {
      console.log(error);

      return null;
    }
  };

  getBuffetMenu = async (
    params: GetBuffetMenuParamsDTO
  ): Promise<GetBuffetMenuDTO | null> => {
    try {
      const buffetMenu = await this.prisma.buffetMenu.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
          special: true,
        },
      });

      return buffetMenu;
    } catch (error) {
      console.log(error);

      return null;
    }
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
  ): Promise<GetDishesListDTO | null> => {
    try {
      const dishesList = await this.prisma.setDish.findUnique({
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
            skip: parseInt(query.offset || "0"),
            take: parseInt(query.limit || "0"),
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

      if (!dishesList) throw new Error();

      return {
        ...dishesList,
        nextPage:
          dishesList?._count.dishes! >
          parseInt(query.offset) + parseInt(query.limit)
            ? parseInt(query.offset) + parseInt(query.limit)
            : null,
        idBuffetMenu: query.buffet_menu_id,
        idSetDish: query.set_dish_id,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

export default DishService;
