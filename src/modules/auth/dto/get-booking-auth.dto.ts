import { EBookingStatus } from '@prisma/client';

export interface GetBookingQueryDTO {
  take: string;
  page: string;
  status?: EBookingStatus;
}
