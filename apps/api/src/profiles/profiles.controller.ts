import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public, Role, Roles } from "../common";
import { ProfilesService } from "./profiles.service";

@ApiTags("Profiles")
@ApiBearerAuth()
@Controller("profiles")
export class ProfilesController {
  constructor(private readonly _profilesService: ProfilesService) {}

  @Post()
  @Roles(Role.PROFESSIONAL)
  @ApiOperation({ summary: "Create professional profile" })
  create(@Body() createProfileDto: any) {
    return this._profilesService.create(createProfileDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Get all profiles" })
  findAll(@Query() query: any) {
    return this._profilesService.findAll(query);
  }

  @Get("slug/:slug")
  @Public()
  @ApiOperation({ summary: "Get profile by slug" })
  findBySlug(@Param("slug") slug: string) {
    return this._profilesService.findBySlug(slug);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get profile by ID" })
  findOne(@Param("id") id: string) {
    return this._profilesService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.PROFESSIONAL)
  @ApiOperation({ summary: "Update profile" })
  update(@Param("id") id: string, @Body() updateProfileDto: any) {
    return this._profilesService.update(id, updateProfileDto);
  }

  @Delete(":id")
  @Roles(Role.PROFESSIONAL, Role.ADMIN)
  @ApiOperation({ summary: "Delete profile" })
  remove(@Param("id") id: string) {
    return this._profilesService.remove(id);
  }
}
