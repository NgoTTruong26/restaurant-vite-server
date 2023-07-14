export interface SetDishConnectedDTO {
  id?: string;
  name?: string;
}

export interface DishConnectedDTO {
  id?: string;
  name?: string;
}

interface RecordsEditHistory {
  modifiedByAdminId: string;
  note?: string;
}

export interface ConnectDishes<T> {
  idSetDish: string;
  data: T[];
  RecordsEditHistory: RecordsEditHistory;
}
