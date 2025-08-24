import { Injectable } from "@nestjs/common";

@Injectable()
export class BookingsService {
  constructor() {}

  create(createBookingDto: any) {
    return { message: "Booking created", data: createBookingDto };
  }

  findAll() {
    return { message: "All bookings", data: [] };
  }

  findOne(id: string) {
    return { message: "Booking found", data: { id } };
  }

  updateStatus(id: string, statusDto: any) {
    return { message: "Status updated", data: { id, statusDto } };
  }

  remove(id: string) {
    return { message: "Booking removed", data: { id } };
  }
}
