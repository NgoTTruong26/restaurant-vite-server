export class GetBuffetMenuQueryDTO {
  get_dish: string;
  limit: string;
}

export class GetSetDishQueryDTO {
  buffet_menu_id: string;
}

export interface GetDishesQueryDTO {
  buffet_menu_id: string;
  set_dish_id: string;
  limit: string;
  offset: string;
}
