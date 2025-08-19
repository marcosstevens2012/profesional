import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Role, Roles } from "../common";
import { AdminService } from "./admin.service";

@ApiTags("Admin")
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get admin dashboard stats" })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get("users")
  @ApiOperation({ summary: "Get all users with admin view" })
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch("users/:id/status")
  @ApiOperation({ summary: "Update user status" })
  updateUserStatus(@Param("id") id: string, @Body() statusDto: any) {
    return this.adminService.updateUserStatus(id, statusDto);
  }

  @Get("reports")
  @ApiOperation({ summary: "Get system reports" })
  getReports() {
    return this.adminService.getReports();
  }
}
