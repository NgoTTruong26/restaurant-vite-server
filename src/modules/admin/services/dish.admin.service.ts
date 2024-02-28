import { PrismaClient } from '@prisma/client';
import prismaClient from '../../../configs/prisma.config';
import {
  GetBuffetMenuDTO,
  GetDishDTO,
  GetSetDishDTO,
} from '../../dish/dto/get-dishes.dto';
import {
  ConnectDishes,
  DishConnectedDTO,
  SetDishConnectedDTO,
} from '../dto/connect-dish.dto';
import { DisconnectDishes } from '../dto/disconnec-dish.dto';
import {
  CreateBuffetMenuDTO,
  CreateDish,
  CreateSetDishDTO,
} from '../dto/dish.dto';

class DishService {
  constructor(private prisma: PrismaClient = prismaClient) {}

  createVAT = async (): Promise<void> => {
    await this.prisma.vAT.create({
      data: {
        tax: 5,
      },
    });
  };

  createBookingStatus = async () => {
    await this.prisma.bookingStatus.createMany({
      data: [],
    });
  };

  createBuffetMenu = async (
    payload: CreateBuffetMenuDTO,
  ): Promise<GetBuffetMenuDTO> => {
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

  createSetDish = async (payload: CreateSetDishDTO): Promise<GetSetDishDTO> => {
    const { createdAt, updatedAt, ...setDish } =
      await this.prisma.setDish.create({
        data: {
          name: payload.name,
          image: payload.image,
        },
      });

    return setDish;
  };

  createDish = async (payload: CreateDish): Promise<GetDishDTO> => {
    const { createdAt, updatedAt, ...setDish } = await this.prisma.dish.create({
      data: {
        name: payload.name,
        image: payload.image,
      },
    });

    return setDish;
  };

  connectBuffetMenuWithSetDish = async (
    payload: ConnectDishes<SetDishConnectedDTO>,
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
    payload: ConnectDishes<DishConnectedDTO>,
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
    payload: DisconnectDishes<SetDishConnectedDTO>,
  ) => {
    await this.prisma.buffetMenu.update({
      where: { id: 'cliydv7hw0000vvhkf81xcj78' },
      data: {
        setDishes: {
          disconnect: { id: 'cliyffrjn0000vvbc66e875ac' },
        },
      },
    });
  };
}

export default DishService;
