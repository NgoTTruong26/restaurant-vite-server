export class GetListDishDTO {
  dishes: GetDishDTO[];
  _count: {
    dishes: number;
  };
  nextPage: number | null;
  idBuffetMenu: string;
  idSetDish: string;
}

export class GetDishDTO {
  id: string;
  image: string;
  name: string;
  byNumberOfPeople: boolean;
  price?: string | null;
}

export class GetSetDishDTO {
  id: string;
  image: string;
  name: string;
  special: boolean;
  dishes?: GetDishDTO[];
}

export class GetBuffetMenuDTO {
  id: string;
  name: string;
  image: string;
  special: boolean;
  setDishes?: GetSetDishDTO[];
}
