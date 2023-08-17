import { GetBuffetMenuDTO } from "../../dish/dto/get-dishes.dto";
import { GetBookingStatusDTO } from "./get-booking-status.dto";
import { GetChildrenCategoryDTO } from "./get-children-category.dto";

export class GetVATDTO {
  id: string;
  tax: number;
}

export class GetInvoicePriceDTO {
  id: string;
  price: number;
  VAT: GetVATDTO;
}

class CreateBookingsForChildren {
  childrenCategoryId: string;
  childrenCategory: string;
  deals: number;
  quantity: number;
}

export class CreateBookingDTO {
  buffetMenu: string;
  phoneNumber: string;
  userId?: string;
  author: string;
  bookingTime: string;
  bookingDate: string;
  numberPeople: number;
  note?: string;
  bookingsForChildren: CreateBookingsForChildren[];
}

export class GetBookingsForChildren {
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
  invoicePrice: GetInvoicePriceDTO;
  cancellation: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}
