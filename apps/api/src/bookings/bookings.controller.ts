import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Role, Roles } from "../common";
import { BookingsService } from "./bookings.service";

@ApiTags("Bookings")
@ApiBearerAuth()
@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: "Create booking request" })
  create(@Body() createBookingDto: any) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: "Get user bookings" })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get booking by ID" })
  findOne(@Param("id") id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(":id/status")
  @Roles(Role.PROFESSIONAL, Role.ADMIN)
  @ApiOperation({ summary: "Update booking status" })
  updateStatus(@Param("id") id: string, @Body() statusDto: any) {
    return this.bookingsService.updateStatus(id, statusDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Cancel booking" })
  remove(@Param("id") id: string) {
    return this.bookingsService.remove(id);
  }
}
