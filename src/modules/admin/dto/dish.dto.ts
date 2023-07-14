export interface CreateBuffetMenuDTO {
  name: string;
  image: string;
}

export interface CreateSetDishDTO {
  name: string;
  image: string;
}

export interface CreateDish {
  name: string;
  image: string;
  byNumberOfPeople?: boolean;
  price?: string;
}
