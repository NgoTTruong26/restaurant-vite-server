export interface IBodyResponse<T> {
  status: number;
  message: string;
  data?: T;
}
