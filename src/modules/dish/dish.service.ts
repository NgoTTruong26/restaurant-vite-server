import prismaClient from "../../configs/prisma.config";
import { GetDishesQueryDTO } from "./dto/get-dishes-params.dto";
import { GetBuffetMenuDTO } from "./dto/get-dishes.dto";

class DishService {
  constructor(private prisma = prismaClient) {}

  getBuffetMenu = async (): Promise<GetBuffetMenuDTO[]> => {
    const buffetMenu = await this.prisma.buffetMenu.findMany({
      include: {
        setDishes: true,
      },
    });

    return buffetMenu;
  };

  getDishes = async (query: GetDishesQueryDTO) => {
    try {
      const dishes = await this.prisma.setDish.findUnique({
        where: {
          id: query.set_dish_id,
        },

        select: {
          dishes: {
            skip: parseInt(query.offset),
            take: parseInt(query.limit),
            where: {
              setDishes: {
                some: {
                  buffetMenus: {
                    some: {
                      id: query.buffet_menu_id,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              dishes: true,
            },
          },
        },
      });

      return {
        ...dishes,
        nextPage:
          dishes?._count.dishes! >
          parseInt(query.offset) + parseInt(query.limit),
      };
    } catch (error) {
      console.log(error);
    }
  };
}

export default DishService;
