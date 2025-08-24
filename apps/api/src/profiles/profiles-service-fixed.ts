import { Injectable } from "@nestjs/common";
import { PaginatedResponse, ProfessionalProfile } from "@profesional/contracts";

@Injectable()
export class ProfilesService {
  // Mock data for testing
  private mockProfiles: Array<
    ProfessionalProfile & {
      user?: { name: string; avatarUrl?: string };
      slug?: string;
      location?: string;
      skills?: string[];
      responseTime?: string;
      services?: Array<{ id: string; title: string; price: number }>;
      reviews?: Array<{
        id: string;
        rating: number;
        comment: string;
        client: string;
      }>;
    }
  > = [
    {
      id: "1",
      userId: "user1",
      title: "Desarrollador Full-Stack",
      description:
        "Especialista en React, Node.js y bases de datos. Más de 5 años creando aplicaciones web modernas.",
      hourlyRate: 15000,
      currency: "ARS" as const,
      experience: 5,
      isVerified: true,
      rating: 4.8,
      reviewCount: 42,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      isAvailable: true,
      completedBookings: 42,
      portfolio: [
        "https://example.com/portfolio/ecommerce-platform",
        "https://example.com/portfolio/task-management",
      ],
      certifications: ["AWS Certified", "React Professional"],
      languages: ["es", "en"],
      // Campos adicionales
      user: {
        name: "Juan Pérez",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=juan",
      },
      slug: "juan-perez-fullstack",
      location: "Buenos Aires, Argentina",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
      responseTime: "2 horas",
      services: [
        { id: "1", title: "Desarrollo Frontend", price: 12000 },
        { id: "2", title: "Desarrollo Backend", price: 15000 },
        { id: "3", title: "Consultoría técnica", price: 18000 },
      ],
      reviews: [
        {
          id: "1",
          rating: 5,
          comment: "Excelente trabajo, muy profesional",
          client: "María González",
        },
        {
          id: "2",
          rating: 4,
          comment: "Entregó en tiempo y forma",
          client: "Carlos López",
        },
      ],
    },
    {
      id: "2",
      userId: "user2",
      title: "Diseñadora UX/UI",
      description:
        "Diseñadora especializada en experiencia de usuario y interfaces modernas. Portfolio con más de 50 proyectos.",
      hourlyRate: 12000,
      currency: "ARS" as const,
      experience: 3,
      isVerified: false,
      rating: 4.6,
      reviewCount: 28,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      isAvailable: true,
      completedBookings: 28,
      portfolio: [
        "https://example.com/portfolio/mobile-banking-app",
        "https://example.com/portfolio/elearning-platform",
      ],
      certifications: ["Google UX Design", "Figma Expert"],
      languages: ["es", "en"],
      // Campos adicionales
      user: {
        name: "Ana Rodríguez",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
      },
      slug: "ana-rodriguez-uxui",
      location: "Córdoba, Argentina",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
      responseTime: "4 horas",
      services: [
        { id: "4", title: "Diseño de interfaces", price: 10000 },
        { id: "5", title: "Prototipado", price: 8000 },
        { id: "6", title: "Research UX", price: 15000 },
      ],
      reviews: [
        {
          id: "3",
          rating: 5,
          comment: "Diseños increíbles, muy creativa",
          client: "Pedro Martín",
        },
      ],
    },
    {
      id: "3",
      userId: "user3",
      title: "Especialista en Marketing Digital",
      description:
        "Experto en campañas de Google Ads, Facebook Ads y SEO. Ayudo a empresas a aumentar sus ventas online.",
      hourlyRate: 8000,
      currency: "ARS" as const,
      experience: 4,
      isVerified: true,
      rating: 4.9,
      reviewCount: 67,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
      isAvailable: true,
      completedBookings: 67,
      portfolio: [
        "https://example.com/portfolio/ecommerce-growth",
        "https://example.com/portfolio/saas-lead-generation",
      ],
      certifications: [
        "Google Ads Certified",
        "Facebook Blueprint",
        "HubSpot Certified",
      ],
      languages: ["es", "en", "pt"],
      // Campos adicionales
      user: {
        name: "Luis Fernández",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=luis",
      },
      slug: "luis-fernandez-marketing",
      location: "Rosario, Argentina",
      skills: ["Google Ads", "Facebook Ads", "SEO", "Analytics"],
      responseTime: "1 hora",
      services: [
        { id: "7", title: "Campaña Google Ads", price: 6000 },
        { id: "8", title: "Optimización SEO", price: 10000 },
        { id: "9", title: "Social Media", price: 7000 },
      ],
      reviews: [
        {
          id: "4",
          rating: 5,
          comment: "Aumentó mis ventas un 200%",
          client: "Roberto Silva",
        },
        {
          id: "5",
          rating: 5,
          comment: "Muy profesional y efectivo",
          client: "Laura Morales",
        },
      ],
    },
  ];

  create(createProfileDto: any) {
    return { message: "Profile created", data: createProfileDto };
  }

  async findAll(
    query: any = {}
  ): Promise<PaginatedResponse<ProfessionalProfile>> {
    let filteredProfiles = [...this.mockProfiles];

    // Apply filters
    if (query.category) {
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.title.toLowerCase().includes(query.category.toLowerCase())
      );
    }

    if (query.location) {
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.location?.toLowerCase().includes(query.location.toLowerCase())
      );
    }

    if (query.minRate) {
      filteredProfiles = filteredProfiles.filter(
        profile => profile.hourlyRate >= parseInt(query.minRate)
      );
    }

    if (query.maxRate) {
      filteredProfiles = filteredProfiles.filter(
        profile => profile.hourlyRate <= parseInt(query.maxRate)
      );
    }

    if (query.rating) {
      filteredProfiles = filteredProfiles.filter(
        profile => profile.rating >= parseFloat(query.rating)
      );
    }

    if (query.isVerified !== undefined) {
      const isVerified = query.isVerified === "true";
      filteredProfiles = filteredProfiles.filter(
        profile => profile.isVerified === isVerified
      );
    }

    // Pagination
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProfiles.length / limit);

    return {
      success: true,
      data: paginatedProfiles,
      pagination: {
        page,
        limit,
        total: filteredProfiles.length,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<ProfessionalProfile | null> {
    const profile = this.mockProfiles.find(p => p.id === id);
    return profile || null;
  }

  async findBySlug(slug: string): Promise<ProfessionalProfile | null> {
    const profile = this.mockProfiles.find(p => p.slug === slug);
    return profile || null;
  }

  update(id: string, updateProfileDto: any) {
    return { message: `Profile #${id} updated`, data: updateProfileDto };
  }

  remove(id: string) {
    return { message: `Profile #${id} deleted` };
  }
}
