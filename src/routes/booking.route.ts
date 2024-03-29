import Verify from '../middlewares/verify.middleware';
import BookingController from '../modules/bookings/booking.controller';
import BaseRoute from './base.route';

class BookingRoute extends BaseRoute {
  private bookingController: BookingController;
  private verify: Verify;

  constructor() {
    super();
    this.bookingController = new BookingController();
    this.verify = new Verify();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router
      .get(
        '/get-bookings-table',
        this.verify.verifyAccessToken,
        this.bookingController.getBookings,
      )
      .get('/children-category', this.bookingController.getChildrenCategory)
      .get('/', this.bookingController.getOneBooking)
      .get('/get-booking-status', this.bookingController.getBookingStatus)
      .post(
        '/',
        this.verify.verifyAccessToken,
        this.bookingController.createBooking,
      )
      .put(
        '/cancel-booking/:idBooking',
        this.verify.verifyAccessToken,
        this.bookingController.cancelBooking,
      );
  }
}

export default BookingRoute;
