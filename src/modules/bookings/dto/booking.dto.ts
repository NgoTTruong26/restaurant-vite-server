import { GetBuffetMenuDTO } from "../../dish/dto/get-dishes.dto";
import { GetBookingStatusDTO } from "./get-booking-status.dto";
import { GetChildrenCategoryDTO } from "./get-children-category.dto";

class CreateBookingsForChildren {
  childrenCategoryId: string;
  childrenCategory: string;
  deals: number;
  quantity: number;
}

export class CreateBookingDTO {
  buffetMenu: string;
  phoneNumber: string;
  author: string;
  bookingTime: string;
  bookingDate: string;
  numberPeople: number;
  note?: string;
  bookingsForChildren: CreateBookingsForChildren[];
}

class GetBookingsForChildren {
  id: string;
  childrenCategory: GetChildrenCategoryDTO;
  quantity: number;
}

export class GetBookingDTO {
  id: string;
  phoneNumber: string;
  author: string;
  bookingTime: string;
  bookingDate: string;
  numberPeople: number;
  note?: string | null;
  buffetMenu: GetBuffetMenuDTO;
  bookingsForChildren: GetBookingsForChildren[];
  bookingStatus: GetBookingStatusDTO;
}
