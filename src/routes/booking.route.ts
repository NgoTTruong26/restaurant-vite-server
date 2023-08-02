import BookingController from "../modules/bookings/booking.controller";
import BaseRoute from "./base.route";

class BookingRoute extends BaseRoute {
  private bookingController: BookingController;

  constructor() {
    super();
    this.bookingController = new BookingController();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router
      .get("/children-category", this.bookingController.getChildrenCategory)
      .get("/", this.bookingController.getOneBooking)
      .get("/get-booking-status", this.bookingController.getBookingStatus)
      .post("/get-booking-status", this.bookingController.createBookingStatus)
      .post("/", this.bookingController.createBooking);
  }
}

export default BookingRoute;
