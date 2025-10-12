import { ProfessionalProfile } from "@/lib/contracts";

// Tipo extendido para los datos mock del profesional
export interface ProfessionalProfileExtended extends ProfessionalProfile {
  user?: {
    name: string;
    avatarUrl?: string;
  };
  slug?: string;
  location?: string;
  skills?: string[];
  responseTime?: string;
  services?: Array<{
    id: string;
    title: string;
    price: number;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    client: string;
  }>;
}
