import { Injectable, NotFoundException } from "@nestjs/common";
import { Profile } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfileDto: any): Promise<any> {
    // This would be for creating professional profiles
    // For now, return a mock implementation
    return {
      message: "Profile creation not implemented yet",
      data: createProfileDto,
    };
  }

  async getMyProfile(userId: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found for this user");
    }

    return profile;
  }

  async updateMyProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto
  ): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found for this user");
    }

    return this.prisma.profile.update({
      where: { userId },
      data: updateProfileDto,
    });
  }

  async findAll(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const skip = (page - 1) * limit;

    const [profiles, total] = await Promise.all([
      this.prisma.profile.findMany({
        skip,
        take: limit,
        where: {
          user: {
            status: "ACTIVE",
            deletedAt: null,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.profile.count({
        where: {
          user: {
            status: "ACTIVE",
            deletedAt: null,
          },
        },
      }),
    ]);

    return {
      data: profiles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string): Promise<Profile | null> {
    // Para Profile, buscamos por ID ya que no tiene campo slug
    return this.prisma.profile.findFirst({
      where: { id: slug },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return profile;
  }

  async update(id: string, updateProfileDto: any): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return this.prisma.profile.update({
      where: { id },
      data: updateProfileDto,
    });
  }

  async remove(id: string): Promise<void> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    await this.prisma.profile.delete({
      where: { id },
    });
  }
}
