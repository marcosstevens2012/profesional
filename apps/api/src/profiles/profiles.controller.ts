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
import { ProfilesService } from "./profiles.service";

@ApiTags("Profiles")
@ApiBearerAuth()
@Controller("profiles")
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @Roles(Role.PROFESSIONAL)
  @ApiOperation({ summary: "Create professional profile" })
  create(@Body() createProfileDto: any) {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all profiles" })
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get profile by ID" })
  findOne(@Param("id") id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.PROFESSIONAL)
  @ApiOperation({ summary: "Update profile" })
  update(@Param("id") id: string, @Body() updateProfileDto: any) {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(":id")
  @Roles(Role.PROFESSIONAL, Role.ADMIN)
  @ApiOperation({ summary: "Delete profile" })
  remove(@Param("id") id: string) {
    return this.profilesService.remove(id);
  }
}
