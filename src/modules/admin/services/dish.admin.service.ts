import { BuffetMenu, Dish, PrismaClient, SetDish } from "@prisma/client";
import {
  CreateBuffetMenuDTO,
  CreateDish,
  CreateSetDishDTO,
} from "../dto/dish.dto";
import { ResponseDishDTO } from "../dto/response.dto";
import prismaClient from "../../../configs/prisma.config";
import {
  ConnectDishes,
  DishConnectedDTO,
  SetDishConnectedDTO,
} from "../dto/connectDish.dto";
import { DisconnectDishes } from "../dto/disconnectDish.dto";

class DishService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  createBuffetMenu = async (
    payload: CreateBuffetMenuDTO
  ): Promise<ResponseDishDTO<BuffetMenu>> => {
    const { createdAt, updatedAt, ...buffetMenu } =
      await this.prisma.buffetMenu.create({
        data: {
          name: payload.name,
          price: payload.price,
          image: payload.image,
        },
      });

    return buffetMenu;
  };

  createSetDish = async (
    payload: CreateSetDishDTO
  ): Promise<ResponseDishDTO<SetDish>> => {
    const { createdAt, updatedAt, ...setDish } =
      await this.prisma.setDish.create({
        data: {
          name: payload.name,
          image: payload.image,
        },
      });

    return setDish;
  };

  createDish = async (payload: CreateDish): Promise<ResponseDishDTO<Dish>> => {
    const { createdAt, updatedAt, ...setDish } = await this.prisma.dish.create({
      data: {
        name: payload.name,
        image: payload.image,
      },
    });

    return setDish;
  };

  connectBuffetMenuWithSetDish = async (
    payload: ConnectDishes<SetDishConnectedDTO>
  ): Promise<void> => {
    await this.prisma.buffetMenu.update({
      where: { id: payload.idSetDish },
      data: {
        setDishes: {
          connect: payload.data as any,
        },
        RecordsEditHistory: {
          create: payload.RecordsEditHistory,
        },
      },
    });
  };

  connectSetDishWithDish = async (
    payload: ConnectDishes<DishConnectedDTO>
  ): Promise<void> => {
    await this.prisma.setDish.update({
      where: { id: payload.idSetDish },
      data: {
        dishes: {
          connect: payload.data as any,
        },
        RecordsEditHistory: {
          create: payload.RecordsEditHistory,
        },
      },
    });
  };

  disconnectBuffetMenuWithSetDish = async (
    payload: DisconnectDishes<SetDishConnectedDTO>
  ) => {
    await this.prisma.buffetMenu.update({
      where: { id: "cliydv7hw0000vvhkf81xcj78" },
      data: {
        setDishes: {
          disconnect: { id: "cliyffrjn0000vvbc66e875ac" },
        },
      },
    });
  };
}

export default DishService;
