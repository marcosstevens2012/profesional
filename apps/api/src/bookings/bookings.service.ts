import { Injectable } from "@nestjs/common";

@Injectable()
export class BookingsService {
  create(createBookingDto: any) {
    return { message: "Booking created", data: createBookingDto };
  }

  findAll() {
    return { message: "User bookings", data: [] };
  }

  findOne(id: string) {
    return { message: `Booking ${id}`, data: { id } };
  }

  updateStatus(id: string, statusDto: any) {
    return { message: `Booking ${id} status updated`, data: statusDto };
  }

  remove(id: string) {
    return { message: `Booking ${id} cancelled` };
  }
}
