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
  constructor(private readonly _bookingsService: BookingsService) {}

  @Post()
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: "Create booking request" })
  create(@Body() createBookingDto: any) {
    return this._bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: "Get user bookings" })
  findAll() {
    return this._bookingsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get booking by ID" })
  findOne(@Param("id") id: string) {
    return this._bookingsService.findOne(id);
  }

  @Patch(":id/status")
  @Roles(Role.PROFESSIONAL, Role.ADMIN)
  @ApiOperation({ summary: "Update booking status" })
  updateStatus(@Param("id") id: string, @Body() statusDto: any) {
    return this._bookingsService.updateStatus(id, statusDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Cancel booking" })
  remove(@Param("id") id: string) {
    return this._bookingsService.remove(id);
  }
}
