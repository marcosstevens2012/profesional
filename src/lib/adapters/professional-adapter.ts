export interface FrontendProfessional {
  id: string;
  user?: {
    name?: string;
    avatarUrl?: string;
  };
  title?: string;
  rating: number;
  reviewCount: number;
  location: string;
  description: string;
  hourlyRate?: number;
  skills?: string[];
  slug?: string;
}

export function adaptBackendProfessionalToFrontend(
  backendData: any
): FrontendProfessional {
  const firstName = backendData.user?.profile?.firstName || "";
  const lastName = backendData.user?.profile?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  // Handle location - it might come as an object with city/province or as a direct property
  let location = "";
  if (backendData.location) {
    if (typeof backendData.location === "string") {
      location = backendData.location;
    } else if (typeof backendData.location === "object") {
      const city = backendData.location.city || "";
      const province = backendData.location.province || "";
      location = `${city}${city && province ? ", " : ""}${province}`.trim();
    }
  }

  // Fallback to profile location if professional location is not available
  if (!location && backendData.user?.profile?.location) {
    const profileLoc = backendData.user.profile.location;
    if (typeof profileLoc === "string") {
      location = profileLoc;
    } else if (typeof profileLoc === "object") {
      const city = profileLoc.city || "";
      const province = profileLoc.province || "";
      location = `${city}${city && province ? ", " : ""}${province}`.trim();
    }
  }

  // Convert pricePerSession to hourly rate (assuming session duration)
  const pricePerSession = parseInt(backendData.pricePerSession || "0");
  const hourlyRate = pricePerSession;

  return {
    id: backendData.id,
    user: {
      name: fullName || backendData.user?.email,
      avatarUrl: backendData.user?.profile?.avatar,
    },
    title: backendData.serviceCategory?.name || backendData.bio,
    rating: backendData.rating || 0,
    reviewCount: backendData.reviewCount || 0,
    location: location || "Ubicación no especificada",
    description: backendData.description || backendData.bio || "",
    hourlyRate: hourlyRate,
    skills: backendData.tags || [],
    slug: backendData.slug || backendData.id,
  };
}

export function adaptPaginatedProfessionals(backendResponse: any) {
  return {
    success: true,
    data: backendResponse.data?.map(adaptBackendProfessionalToFrontend) || [],
    pagination: {
      page: backendResponse.meta?.page || 1,
      limit: backendResponse.meta?.limit || 20,
      total: backendResponse.meta?.total || 0,
      totalPages: backendResponse.meta?.totalPages || 0,
      hasNext:
        (backendResponse.meta?.page || 1) <
        (backendResponse.meta?.totalPages || 0),
      hasPrev: (backendResponse.meta?.page || 1) > 1,
    },
  };
}
