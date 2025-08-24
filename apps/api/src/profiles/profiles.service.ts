import { Injectable, NotFoundException } from "@nestjs/common";
import { Profile } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfilesService {
  constructor(private readonly _prisma: PrismaService) {}

  async create(createProfileDto: any): Promise<any> {
    // This would be for creating professional profiles
    // For now, return a mock implementation
    return {
      message: "Profile creation not implemented yet",
      data: createProfileDto,
    };
  }

  async getMyProfile(userId: string): Promise<Profile> {
    const profile = await this._prisma.profile.findUnique({
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
    const profile = await this._prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found for this user");
    }

    return this._prisma.profile.update({
      where: { userId },
      data: updateProfileDto,
    });
  }

  async findAll(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || "createdAt";

    // Construir ordenamiento
    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "rating") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "name") {
      orderBy = { name: "asc" };
    } else if (sortBy === "price") {
      orderBy = { pricePerSession: "asc" };
    }

    const [profiles, total] = await Promise.all([
      this._prisma.professionalProfile.findMany({
        skip,
        take: limit,
        where: {
          deletedAt: null,
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
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
          serviceCategory: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          location: {
            select: {
              id: true,
              province: true,
              city: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              client: {
                select: {
                  profile: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
        orderBy,
      }),
      this._prisma.professionalProfile.count({
        where: {
          deletedAt: null,
          user: {
            status: "ACTIVE",
            deletedAt: null,
          },
        },
      }),
    ]);

    // Transform the data to format location as string
    const transformedProfiles = profiles.map(profile => ({
      ...profile,
      location: profile.location
        ? `${profile.location.city}, ${profile.location.province}`
        : null,
    }));

    return {
      data: transformedProfiles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string): Promise<any> {
    // Buscar por ID ya que ProfessionalProfile no tiene slug por ahora
    // TODO: Implementar slug generation para profesionales
    const profile = await this._prisma.professionalProfile.findFirst({
      where: { id: slug },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        serviceCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        location: {
          select: {
            id: true,
            province: true,
            city: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            client: {
              select: {
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!profile) {
      return null;
    }

    // Transform location to string format
    return {
      ...profile,
      location: profile.location
        ? `${profile.location.city}, ${profile.location.province}`
        : null,
    };
  }

  async findOne(id: string): Promise<any> {
    const profile = await this._prisma.professionalProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        serviceCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        location: {
          select: {
            id: true,
            province: true,
            city: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            client: {
              select: {
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException("Professional profile not found");
    }

    // Transform location to string format
    return {
      ...profile,
      location: profile.location
        ? `${profile.location.city}, ${profile.location.province}`
        : null,
    };
  }

  async update(id: string, updateProfileDto: any): Promise<Profile> {
    const profile = await this._prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return this._prisma.profile.update({
      where: { id },
      data: updateProfileDto,
    });
  }

  async remove(id: string): Promise<void> {
    const profile = await this._prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    await this._prisma.profile.delete({
      where: { id },
    });
  }
}
