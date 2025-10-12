import { z } from "zod";
export declare const IdSchema: z.ZodString;
export declare const TimestampsSchema: z.ZodObject<
  {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    createdAt?: Date;
    updatedAt?: Date;
  },
  {
    createdAt?: Date;
    updatedAt?: Date;
  }
>;
export declare const UserSchema: z.ZodObject<
  {
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    role: z.ZodDefault<z.ZodEnum<["client", "professional", "admin"]>>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    role?: "professional" | "client" | "admin";
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    avatar?: string;
    isActive?: boolean;
  },
  {
    name?: string;
    id?: string;
    role?: "professional" | "client" | "admin";
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    avatar?: string;
    isActive?: boolean;
  }
>;
export declare const CreateUserSchema: z.ZodObject<
  {
    email: z.ZodString;
    name: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<["client", "professional"]>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    role?: "professional" | "client";
    email?: string;
    avatar?: string;
  },
  {
    name?: string;
    role?: "professional" | "client";
    email?: string;
    avatar?: string;
  }
>;
export declare const UpdateUserSchema: z.ZodObject<
  {
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    email?: string;
    avatar?: string;
    isActive?: boolean;
  },
  {
    name?: string;
    email?: string;
    avatar?: string;
    isActive?: boolean;
  }
>;
export declare const UserViewSchema: z.ZodObject<
  Omit<
    {
      id: z.ZodString;
      email: z.ZodString;
      name: z.ZodString;
      avatar: z.ZodOptional<z.ZodString>;
      isActive: z.ZodDefault<z.ZodBoolean>;
      role: z.ZodDefault<z.ZodEnum<["client", "professional", "admin"]>>;
    } & {
      createdAt: z.ZodDate;
      updatedAt: z.ZodDate;
    },
    "updatedAt"
  > & {
    profile: z.ZodOptional<z.ZodAny>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    profile?: any;
    id?: string;
    role?: "professional" | "client" | "admin";
    email?: string;
    createdAt?: Date;
    avatar?: string;
    isActive?: boolean;
  },
  {
    name?: string;
    profile?: any;
    id?: string;
    role?: "professional" | "client" | "admin";
    email?: string;
    createdAt?: Date;
    avatar?: string;
    isActive?: boolean;
  }
>;
export declare const RegisterRequestSchema: z.ZodObject<
  {
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["client", "professional"]>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    role?: "professional" | "client";
    email?: string;
    password?: string;
  },
  {
    name?: string;
    role?: "professional" | "client";
    email?: string;
    password?: string;
  }
>;
export declare const LoginRequestSchema: z.ZodObject<
  {
    email: z.ZodString;
    password: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    email?: string;
    password?: string;
  },
  {
    email?: string;
    password?: string;
  }
>;
export declare const RefreshTokenRequestSchema: z.ZodObject<
  {
    refreshToken: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    refreshToken?: string;
  },
  {
    refreshToken?: string;
  }
>;
export declare const ForgotPasswordRequestSchema: z.ZodObject<
  {
    email: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    email?: string;
  },
  {
    email?: string;
  }
>;
export declare const ResetPasswordRequestSchema: z.ZodObject<
  {
    token: z.ZodString;
    password: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    password?: string;
    token?: string;
  },
  {
    password?: string;
    token?: string;
  }
>;
export declare const VerifyEmailRequestSchema: z.ZodObject<
  {
    token: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    token?: string;
  },
  {
    token?: string;
  }
>;
export declare const AuthTokensSchema: z.ZodObject<
  {
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    expiresIn: z.ZodNumber;
  },
  "strip",
  z.ZodTypeAny,
  {
    refreshToken?: string;
    accessToken?: string;
    expiresIn?: number;
  },
  {
    refreshToken?: string;
    accessToken?: string;
    expiresIn?: number;
  }
>;
export declare const AuthUserSchema: z.ZodObject<
  {
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    role: z.ZodDefault<z.ZodEnum<["client", "professional", "admin"]>>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  } & {
    status: z.ZodDefault<
      z.ZodEnum<["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"]>
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    role?: "professional" | "client" | "admin";
    email?: string;
    status?: "ACTIVE" | "SUSPENDED" | "INACTIVE" | "PENDING_VERIFICATION";
    createdAt?: Date;
    updatedAt?: Date;
    avatar?: string;
    isActive?: boolean;
  },
  {
    name?: string;
    id?: string;
    role?: "professional" | "client" | "admin";
    email?: string;
    status?: "ACTIVE" | "SUSPENDED" | "INACTIVE" | "PENDING_VERIFICATION";
    createdAt?: Date;
    updatedAt?: Date;
    avatar?: string;
    isActive?: boolean;
  }
>;
export declare const AuthResponseSchema: z.ZodObject<
  {
    user: z.ZodObject<
      {
        id: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        avatar: z.ZodOptional<z.ZodString>;
        isActive: z.ZodDefault<z.ZodBoolean>;
        role: z.ZodDefault<z.ZodEnum<["client", "professional", "admin"]>>;
      } & {
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
      } & {
        status: z.ZodDefault<
          z.ZodEnum<["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"]>
        >;
      },
      "strip",
      z.ZodTypeAny,
      {
        name?: string;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        status?: "ACTIVE" | "SUSPENDED" | "INACTIVE" | "PENDING_VERIFICATION";
        createdAt?: Date;
        updatedAt?: Date;
        avatar?: string;
        isActive?: boolean;
      },
      {
        name?: string;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        status?: "ACTIVE" | "SUSPENDED" | "INACTIVE" | "PENDING_VERIFICATION";
        createdAt?: Date;
        updatedAt?: Date;
        avatar?: string;
        isActive?: boolean;
      }
    >;
    tokens: z.ZodObject<
      {
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        expiresIn: z.ZodNumber;
      },
      "strip",
      z.ZodTypeAny,
      {
        refreshToken?: string;
        accessToken?: string;
        expiresIn?: number;
      },
      {
        refreshToken?: string;
        accessToken?: string;
        expiresIn?: number;
      }
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    user?: {
      name?: string;
      id?: string;
      role?: "professional" | "client" | "admin";
      email?: string;
      status?: "ACTIVE" | "SUSPENDED" | "INACTIVE" | "PENDING_VERIFICATION";
      createdAt?: Date;
      updatedAt?: Date;
      avatar?: string;
      isActive?: boolean;
    };
    tokens?: {
      refreshToken?: string;
      accessToken?: string;
      expiresIn?: number;
    };
  },
  {
    user?: {
      name?: string;
      id?: string;
      role?: "professional" | "client" | "admin";
      email?: string;
      status?: "ACTIVE" | "SUSPENDED" | "INACTIVE" | "PENDING_VERIFICATION";
      createdAt?: Date;
      updatedAt?: Date;
      avatar?: string;
      isActive?: boolean;
    };
    tokens?: {
      refreshToken?: string;
      accessToken?: string;
      expiresIn?: number;
    };
  }
>;
export declare const MessageResponseSchema: z.ZodObject<
  {
    message: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    message?: string;
  },
  {
    message?: string;
  }
>;
export declare const ProfileSchema: z.ZodObject<
  {
    id: z.ZodString;
    userId: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    locationId: z.ZodOptional<z.ZodString>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    phone?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
    locationId?: string;
  },
  {
    id?: string;
    phone?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
    locationId?: string;
  }
>;
export declare const CreateProfileSchema: z.ZodObject<
  {
    phone: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    locationId: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    phone?: string;
    bio?: string;
    locationId?: string;
  },
  {
    phone?: string;
    bio?: string;
    locationId?: string;
  }
>;
export declare const UpdateProfileSchema: z.ZodObject<
  {
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    bio: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    locationId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    phone?: string;
    bio?: string;
    locationId?: string;
  },
  {
    phone?: string;
    bio?: string;
    locationId?: string;
  }
>;
export declare const ProfessionalProfileSchema: z.ZodObject<
  {
    id: z.ZodString;
    userId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    hourlyRate: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["ARS", "USD"]>>;
    experience: z.ZodNumber;
    isVerified: z.ZodDefault<z.ZodBoolean>;
    isAvailable: z.ZodDefault<z.ZodBoolean>;
    rating: z.ZodDefault<z.ZodNumber>;
    reviewCount: z.ZodDefault<z.ZodNumber>;
    completedBookings: z.ZodDefault<z.ZodNumber>;
    profileImage: z.ZodOptional<z.ZodString>;
    portfolio: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    certifications: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    languages: z.ZodDefault<z.ZodArray<z.ZodEnum<["es", "en", "pt"]>, "many">>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    title?: string;
    description?: string;
    rating?: number;
    currency?: "ARS" | "USD";
    isVerified?: boolean;
    languages?: ("es" | "en" | "pt")[];
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
    hourlyRate?: number;
    experience?: number;
    isAvailable?: boolean;
    reviewCount?: number;
    completedBookings?: number;
    profileImage?: string;
    portfolio?: string[];
    certifications?: string[];
  },
  {
    id?: string;
    title?: string;
    description?: string;
    rating?: number;
    currency?: "ARS" | "USD";
    isVerified?: boolean;
    languages?: ("es" | "en" | "pt")[];
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
    hourlyRate?: number;
    experience?: number;
    isAvailable?: boolean;
    reviewCount?: number;
    completedBookings?: number;
    profileImage?: string;
    portfolio?: string[];
    certifications?: string[];
  }
>;
export declare const CreateProfessionalProfileSchema: z.ZodObject<
  {
    title: z.ZodString;
    description: z.ZodString;
    hourlyRate: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["ARS", "USD"]>>;
    experience: z.ZodNumber;
    profileImage: z.ZodOptional<z.ZodString>;
    portfolio: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    certifications: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    languages: z.ZodDefault<z.ZodArray<z.ZodEnum<["es", "en", "pt"]>, "many">>;
  },
  "strip",
  z.ZodTypeAny,
  {
    title?: string;
    description?: string;
    currency?: "ARS" | "USD";
    languages?: ("es" | "en" | "pt")[];
    hourlyRate?: number;
    experience?: number;
    profileImage?: string;
    portfolio?: string[];
    certifications?: string[];
  },
  {
    title?: string;
    description?: string;
    currency?: "ARS" | "USD";
    languages?: ("es" | "en" | "pt")[];
    hourlyRate?: number;
    experience?: number;
    profileImage?: string;
    portfolio?: string[];
    certifications?: string[];
  }
>;
export declare const UpdateProfessionalProfileSchema: z.ZodObject<
  {
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    hourlyRate: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodEnum<["ARS", "USD"]>>>;
    experience: z.ZodOptional<z.ZodNumber>;
    profileImage: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    portfolio: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    certifications: z.ZodOptional<
      z.ZodDefault<z.ZodArray<z.ZodString, "many">>
    >;
    languages: z.ZodOptional<
      z.ZodDefault<z.ZodArray<z.ZodEnum<["es", "en", "pt"]>, "many">>
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    title?: string;
    description?: string;
    currency?: "ARS" | "USD";
    languages?: ("es" | "en" | "pt")[];
    hourlyRate?: number;
    experience?: number;
    profileImage?: string;
    portfolio?: string[];
    certifications?: string[];
  },
  {
    title?: string;
    description?: string;
    currency?: "ARS" | "USD";
    languages?: ("es" | "en" | "pt")[];
    hourlyRate?: number;
    experience?: number;
    profileImage?: string;
    portfolio?: string[];
    certifications?: string[];
  }
>;
export declare const ProfessionalProfileViewSchema: z.ZodObject<
  {
    id: z.ZodString;
    userId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    hourlyRate: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["ARS", "USD"]>>;
    experience: z.ZodNumber;
    isVerified: z.ZodDefault<z.ZodBoolean>;
    isAvailable: z.ZodDefault<z.ZodBoolean>;
    rating: z.ZodDefault<z.ZodNumber>;
    reviewCount: z.ZodDefault<z.ZodNumber>;
    completedBookings: z.ZodDefault<z.ZodNumber>;
    profileImage: z.ZodOptional<z.ZodString>;
    portfolio: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    certifications: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    languages: z.ZodDefault<z.ZodArray<z.ZodEnum<["es", "en", "pt"]>, "many">>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  } & {
    user: z.ZodObject<
      Omit<
        {
          id: z.ZodString;
          email: z.ZodString;
          name: z.ZodString;
          avatar: z.ZodOptional<z.ZodString>;
          isActive: z.ZodDefault<z.ZodBoolean>;
          role: z.ZodDefault<z.ZodEnum<["client", "professional", "admin"]>>;
        } & {
          createdAt: z.ZodDate;
          updatedAt: z.ZodDate;
        },
        "updatedAt"
      > & {
        profile: z.ZodOptional<z.ZodAny>;
      },
      "strip",
      z.ZodTypeAny,
      {
        name?: string;
        profile?: any;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        createdAt?: Date;
        avatar?: string;
        isActive?: boolean;
      },
      {
        name?: string;
        profile?: any;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        createdAt?: Date;
        avatar?: string;
        isActive?: boolean;
      }
    >;
    serviceCategories: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    location: z.ZodOptional<z.ZodAny>;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    title?: string;
    user?: {
      name?: string;
      profile?: any;
      id?: string;
      role?: "professional" | "client" | "admin";
      email?: string;
      createdAt?: Date;
      avatar?: string;
      isActive?: boolean;
    };
    description?: string;
    rating?: number;
    location?: any;
    currency?: "ARS" | "USD";
    isVerified?: boolean;
    languages?: ("es" | "en" | "pt")[];
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
    hourlyRate?: number;
    experience?: number;
    isAvailable?: boolean;
    reviewCount?: number;
    completedBookings?: number;
    profileImage?: string;
    portfolio?: string[];
    certifications?: string[];
    serviceCategories?: any[];
  },
  {
    id?: string;
    title?: string;
    user?: {
      name?: string;
      profile?: any;
      id?: string;
      role?: "professional" | "client" | "admin";
      email?: string;
      createdAt?: Date;
      avatar?: string;
      isActive?: boolean;
    };
    description?: string;
    rating?: number;
    location?: any;
    currency?: "ARS" | "USD";
    isVerified?: boolean;
    languages?: ("es" | "en" | "pt")[];
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
    hourlyRate?: number;
    experience?: number;
    isAvailable?: boolean;
    reviewCount?: number;
    completedBookings?: number;
    profileImage?: string;
    portfolio?: string[];
    certifications?: string[];
    serviceCategories?: any[];
  }
>;
export declare const ServiceCategorySchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    parentId: z.ZodOptional<z.ZodString>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    icon?: string;
    description?: string;
    slug?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    parentId?: string;
  },
  {
    name?: string;
    id?: string;
    icon?: string;
    description?: string;
    slug?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    parentId?: string;
  }
>;
export declare const CreateServiceCategorySchema: z.ZodObject<
  {
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    icon?: string;
    description?: string;
    slug?: string;
    parentId?: string;
  },
  {
    name?: string;
    icon?: string;
    description?: string;
    slug?: string;
    parentId?: string;
  }
>;
export declare const UpdateServiceCategorySchema: z.ZodObject<
  {
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    icon: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    icon?: string;
    description?: string;
    slug?: string;
    parentId?: string;
  },
  {
    name?: string;
    icon?: string;
    description?: string;
    slug?: string;
    parentId?: string;
  }
>;
export declare const ServiceTagSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    color: z.ZodDefault<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    id?: string;
    color?: string;
    slug?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
  },
  {
    name?: string;
    id?: string;
    color?: string;
    slug?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
  }
>;
export declare const CreateServiceTagSchema: z.ZodObject<
  {
    name: z.ZodString;
    slug: z.ZodString;
    color: z.ZodDefault<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    color?: string;
    slug?: string;
  },
  {
    name?: string;
    color?: string;
    slug?: string;
  }
>;
export declare const UpdateServiceTagSchema: z.ZodObject<
  {
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodDefault<z.ZodString>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    color?: string;
    slug?: string;
  },
  {
    name?: string;
    color?: string;
    slug?: string;
  }
>;
export declare const LocationSchema: z.ZodObject<
  {
    id: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
    province: z.ZodString;
    city: z.ZodString;
    zipCode: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    country?: string;
    city?: string;
    province?: string;
    createdAt?: Date;
    updatedAt?: Date;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  },
  {
    id?: string;
    country?: string;
    city?: string;
    province?: string;
    createdAt?: Date;
    updatedAt?: Date;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  }
>;
export declare const CreateLocationSchema: z.ZodObject<
  {
    country: z.ZodDefault<z.ZodString>;
    province: z.ZodString;
    city: z.ZodString;
    zipCode: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
  },
  "strip",
  z.ZodTypeAny,
  {
    country?: string;
    city?: string;
    province?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  },
  {
    country?: string;
    city?: string;
    province?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  }
>;
export declare const UpdateLocationSchema: z.ZodObject<
  {
    country: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    province: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    zipCode: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    latitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    longitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    country?: string;
    city?: string;
    province?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  },
  {
    country?: string;
    city?: string;
    province?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  }
>;
export declare const AvailabilitySlotSchema: z.ZodObject<
  {
    id: z.ZodString;
    professionalId: z.ZodString;
    dayOfWeek: z.ZodNumber;
    startTime: z.ZodString;
    endTime: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    professionalId?: string;
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
  },
  {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    professionalId?: string;
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
  }
>;
export declare const CreateAvailabilitySlotSchema: z.ZodObject<
  {
    dayOfWeek: z.ZodNumber;
    startTime: z.ZodString;
    endTime: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
  },
  {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
  }
>;
export declare const UpdateAvailabilitySlotSchema: z.ZodObject<
  {
    dayOfWeek: z.ZodOptional<z.ZodNumber>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
  },
  {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
  }
>;
export declare const BookingStatusEnum: z.ZodEnum<
  [
    "draft",
    "pending_payment",
    "paid",
    "confirmed",
    "in_progress",
    "completed",
    "canceled",
    "no_show",
  ]
>;
export declare const BookingSchema: z.ZodObject<
  {
    id: z.ZodString;
    clientId: z.ZodString;
    professionalId: z.ZodString;
    serviceDescription: z.ZodString;
    scheduledAt: z.ZodDate;
    duration: z.ZodNumber;
    hourlyRate: z.ZodNumber;
    totalAmount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["ARS", "USD"]>>;
    status: z.ZodDefault<
      z.ZodEnum<
        [
          "draft",
          "pending_payment",
          "paid",
          "confirmed",
          "in_progress",
          "completed",
          "canceled",
          "no_show",
        ]
      >
    >;
    notes: z.ZodOptional<z.ZodString>;
    cancelReason: z.ZodOptional<z.ZodString>;
    canceledAt: z.ZodOptional<z.ZodDate>;
    canceledBy: z.ZodOptional<z.ZodString>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    status?:
      | "draft"
      | "pending_payment"
      | "paid"
      | "confirmed"
      | "in_progress"
      | "completed"
      | "canceled"
      | "no_show";
    currency?: "ARS" | "USD";
    createdAt?: Date;
    updatedAt?: Date;
    hourlyRate?: number;
    professionalId?: string;
    clientId?: string;
    serviceDescription?: string;
    scheduledAt?: Date;
    duration?: number;
    totalAmount?: number;
    notes?: string;
    cancelReason?: string;
    canceledAt?: Date;
    canceledBy?: string;
  },
  {
    id?: string;
    status?:
      | "draft"
      | "pending_payment"
      | "paid"
      | "confirmed"
      | "in_progress"
      | "completed"
      | "canceled"
      | "no_show";
    currency?: "ARS" | "USD";
    createdAt?: Date;
    updatedAt?: Date;
    hourlyRate?: number;
    professionalId?: string;
    clientId?: string;
    serviceDescription?: string;
    scheduledAt?: Date;
    duration?: number;
    totalAmount?: number;
    notes?: string;
    cancelReason?: string;
    canceledAt?: Date;
    canceledBy?: string;
  }
>;
export declare const CreateBookingSchema: z.ZodObject<
  {
    professionalId: z.ZodString;
    serviceDescription: z.ZodString;
    scheduledAt: z.ZodDate;
    duration: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    professionalId?: string;
    serviceDescription?: string;
    scheduledAt?: Date;
    duration?: number;
    notes?: string;
  },
  {
    professionalId?: string;
    serviceDescription?: string;
    scheduledAt?: Date;
    duration?: number;
    notes?: string;
  }
>;
export declare const UpdateBookingSchema: z.ZodObject<
  {
    scheduledAt: z.ZodOptional<z.ZodDate>;
    duration: z.ZodOptional<z.ZodNumber>;
    serviceDescription: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<
      z.ZodEnum<
        [
          "draft",
          "pending_payment",
          "paid",
          "confirmed",
          "in_progress",
          "completed",
          "canceled",
          "no_show",
        ]
      >
    >;
    notes: z.ZodOptional<z.ZodString>;
    cancelReason: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    status?:
      | "draft"
      | "pending_payment"
      | "paid"
      | "confirmed"
      | "in_progress"
      | "completed"
      | "canceled"
      | "no_show";
    serviceDescription?: string;
    scheduledAt?: Date;
    duration?: number;
    notes?: string;
    cancelReason?: string;
  },
  {
    status?:
      | "draft"
      | "pending_payment"
      | "paid"
      | "confirmed"
      | "in_progress"
      | "completed"
      | "canceled"
      | "no_show";
    serviceDescription?: string;
    scheduledAt?: Date;
    duration?: number;
    notes?: string;
    cancelReason?: string;
  }
>;
export declare const BookingViewSchema: z.ZodObject<
  {
    id: z.ZodString;
    clientId: z.ZodString;
    professionalId: z.ZodString;
    serviceDescription: z.ZodString;
    scheduledAt: z.ZodDate;
    duration: z.ZodNumber;
    hourlyRate: z.ZodNumber;
    totalAmount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["ARS", "USD"]>>;
    status: z.ZodDefault<
      z.ZodEnum<
        [
          "draft",
          "pending_payment",
          "paid",
          "confirmed",
          "in_progress",
          "completed",
          "canceled",
          "no_show",
        ]
      >
    >;
    notes: z.ZodOptional<z.ZodString>;
    cancelReason: z.ZodOptional<z.ZodString>;
    canceledAt: z.ZodOptional<z.ZodDate>;
    canceledBy: z.ZodOptional<z.ZodString>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  } & {
    client: z.ZodObject<
      Omit<
        {
          id: z.ZodString;
          email: z.ZodString;
          name: z.ZodString;
          avatar: z.ZodOptional<z.ZodString>;
          isActive: z.ZodDefault<z.ZodBoolean>;
          role: z.ZodDefault<z.ZodEnum<["client", "professional", "admin"]>>;
        } & {
          createdAt: z.ZodDate;
          updatedAt: z.ZodDate;
        },
        "updatedAt"
      > & {
        profile: z.ZodOptional<z.ZodAny>;
      },
      "strip",
      z.ZodTypeAny,
      {
        name?: string;
        profile?: any;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        createdAt?: Date;
        avatar?: string;
        isActive?: boolean;
      },
      {
        name?: string;
        profile?: any;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        createdAt?: Date;
        avatar?: string;
        isActive?: boolean;
      }
    >;
    professional: z.ZodObject<
      {
        id: z.ZodString;
        userId: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        hourlyRate: z.ZodNumber;
        currency: z.ZodDefault<z.ZodEnum<["ARS", "USD"]>>;
        experience: z.ZodNumber;
        isVerified: z.ZodDefault<z.ZodBoolean>;
        isAvailable: z.ZodDefault<z.ZodBoolean>;
        rating: z.ZodDefault<z.ZodNumber>;
        reviewCount: z.ZodDefault<z.ZodNumber>;
        completedBookings: z.ZodDefault<z.ZodNumber>;
        profileImage: z.ZodOptional<z.ZodString>;
        portfolio: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        certifications: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        languages: z.ZodDefault<
          z.ZodArray<z.ZodEnum<["es", "en", "pt"]>, "many">
        >;
      } & {
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
      } & {
        user: z.ZodObject<
          Omit<
            {
              id: z.ZodString;
              email: z.ZodString;
              name: z.ZodString;
              avatar: z.ZodOptional<z.ZodString>;
              isActive: z.ZodDefault<z.ZodBoolean>;
              role: z.ZodDefault<
                z.ZodEnum<["client", "professional", "admin"]>
              >;
            } & {
              createdAt: z.ZodDate;
              updatedAt: z.ZodDate;
            },
            "updatedAt"
          > & {
            profile: z.ZodOptional<z.ZodAny>;
          },
          "strip",
          z.ZodTypeAny,
          {
            name?: string;
            profile?: any;
            id?: string;
            role?: "professional" | "client" | "admin";
            email?: string;
            createdAt?: Date;
            avatar?: string;
            isActive?: boolean;
          },
          {
            name?: string;
            profile?: any;
            id?: string;
            role?: "professional" | "client" | "admin";
            email?: string;
            createdAt?: Date;
            avatar?: string;
            isActive?: boolean;
          }
        >;
        serviceCategories: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
        location: z.ZodOptional<z.ZodAny>;
      },
      "strip",
      z.ZodTypeAny,
      {
        id?: string;
        title?: string;
        user?: {
          name?: string;
          profile?: any;
          id?: string;
          role?: "professional" | "client" | "admin";
          email?: string;
          createdAt?: Date;
          avatar?: string;
          isActive?: boolean;
        };
        description?: string;
        rating?: number;
        location?: any;
        currency?: "ARS" | "USD";
        isVerified?: boolean;
        languages?: ("es" | "en" | "pt")[];
        createdAt?: Date;
        updatedAt?: Date;
        userId?: string;
        hourlyRate?: number;
        experience?: number;
        isAvailable?: boolean;
        reviewCount?: number;
        completedBookings?: number;
        profileImage?: string;
        portfolio?: string[];
        certifications?: string[];
        serviceCategories?: any[];
      },
      {
        id?: string;
        title?: string;
        user?: {
          name?: string;
          profile?: any;
          id?: string;
          role?: "professional" | "client" | "admin";
          email?: string;
          createdAt?: Date;
          avatar?: string;
          isActive?: boolean;
        };
        description?: string;
        rating?: number;
        location?: any;
        currency?: "ARS" | "USD";
        isVerified?: boolean;
        languages?: ("es" | "en" | "pt")[];
        createdAt?: Date;
        updatedAt?: Date;
        userId?: string;
        hourlyRate?: number;
        experience?: number;
        isAvailable?: boolean;
        reviewCount?: number;
        completedBookings?: number;
        profileImage?: string;
        portfolio?: string[];
        certifications?: string[];
        serviceCategories?: any[];
      }
    >;
    payment: z.ZodOptional<z.ZodAny>;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    professional?: {
      id?: string;
      title?: string;
      user?: {
        name?: string;
        profile?: any;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        createdAt?: Date;
        avatar?: string;
        isActive?: boolean;
      };
      description?: string;
      rating?: number;
      location?: any;
      currency?: "ARS" | "USD";
      isVerified?: boolean;
      languages?: ("es" | "en" | "pt")[];
      createdAt?: Date;
      updatedAt?: Date;
      userId?: string;
      hourlyRate?: number;
      experience?: number;
      isAvailable?: boolean;
      reviewCount?: number;
      completedBookings?: number;
      profileImage?: string;
      portfolio?: string[];
      certifications?: string[];
      serviceCategories?: any[];
    };
    client?: {
      name?: string;
      profile?: any;
      id?: string;
      role?: "professional" | "client" | "admin";
      email?: string;
      createdAt?: Date;
      avatar?: string;
      isActive?: boolean;
    };
    status?:
      | "draft"
      | "pending_payment"
      | "paid"
      | "confirmed"
      | "in_progress"
      | "completed"
      | "canceled"
      | "no_show";
    currency?: "ARS" | "USD";
    payment?: any;
    createdAt?: Date;
    updatedAt?: Date;
    hourlyRate?: number;
    professionalId?: string;
    clientId?: string;
    serviceDescription?: string;
    scheduledAt?: Date;
    duration?: number;
    totalAmount?: number;
    notes?: string;
    cancelReason?: string;
    canceledAt?: Date;
    canceledBy?: string;
  },
  {
    id?: string;
    professional?: {
      id?: string;
      title?: string;
      user?: {
        name?: string;
        profile?: any;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        createdAt?: Date;
        avatar?: string;
        isActive?: boolean;
      };
      description?: string;
      rating?: number;
      location?: any;
      currency?: "ARS" | "USD";
      isVerified?: boolean;
      languages?: ("es" | "en" | "pt")[];
      createdAt?: Date;
      updatedAt?: Date;
      userId?: string;
      hourlyRate?: number;
      experience?: number;
      isAvailable?: boolean;
      reviewCount?: number;
      completedBookings?: number;
      profileImage?: string;
      portfolio?: string[];
      certifications?: string[];
      serviceCategories?: any[];
    };
    client?: {
      name?: string;
      profile?: any;
      id?: string;
      role?: "professional" | "client" | "admin";
      email?: string;
      createdAt?: Date;
      avatar?: string;
      isActive?: boolean;
    };
    status?:
      | "draft"
      | "pending_payment"
      | "paid"
      | "confirmed"
      | "in_progress"
      | "completed"
      | "canceled"
      | "no_show";
    currency?: "ARS" | "USD";
    payment?: any;
    createdAt?: Date;
    updatedAt?: Date;
    hourlyRate?: number;
    professionalId?: string;
    clientId?: string;
    serviceDescription?: string;
    scheduledAt?: Date;
    duration?: number;
    totalAmount?: number;
    notes?: string;
    cancelReason?: string;
    canceledAt?: Date;
    canceledBy?: string;
  }
>;
export declare const PaymentStatusEnum: z.ZodEnum<
  [
    "pending",
    "approved",
    "rejected",
    "cancelled",
    "refunded",
    "partially_refunded",
  ]
>;
export declare const PaymentSchema: z.ZodObject<
  {
    id: z.ZodString;
    bookingId: z.ZodString;
    mercadoPagoId: z.ZodOptional<z.ZodString>;
    preferenceId: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["ARS", "USD"]>>;
    status: z.ZodDefault<
      z.ZodEnum<
        [
          "pending",
          "approved",
          "rejected",
          "cancelled",
          "refunded",
          "partially_refunded",
        ]
      >
    >;
    externalReference: z.ZodString;
    description: z.ZodString;
    payerEmail: z.ZodOptional<z.ZodString>;
    paymentMethodId: z.ZodOptional<z.ZodString>;
    installments: z.ZodDefault<z.ZodNumber>;
    transactionAmount: z.ZodOptional<z.ZodNumber>;
    netReceivedAmount: z.ZodOptional<z.ZodNumber>;
    totalPaidAmount: z.ZodOptional<z.ZodNumber>;
    fee: z.ZodDefault<z.ZodNumber>;
    paidAt: z.ZodOptional<z.ZodDate>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    status?:
      | "pending"
      | "approved"
      | "rejected"
      | "cancelled"
      | "refunded"
      | "partially_refunded";
    description?: string;
    bookingId?: string;
    amount?: number;
    currency?: "ARS" | "USD";
    createdAt?: Date;
    updatedAt?: Date;
    mercadoPagoId?: string;
    preferenceId?: string;
    externalReference?: string;
    payerEmail?: string;
    paymentMethodId?: string;
    installments?: number;
    transactionAmount?: number;
    netReceivedAmount?: number;
    totalPaidAmount?: number;
    fee?: number;
    paidAt?: Date;
  },
  {
    id?: string;
    status?:
      | "pending"
      | "approved"
      | "rejected"
      | "cancelled"
      | "refunded"
      | "partially_refunded";
    description?: string;
    bookingId?: string;
    amount?: number;
    currency?: "ARS" | "USD";
    createdAt?: Date;
    updatedAt?: Date;
    mercadoPagoId?: string;
    preferenceId?: string;
    externalReference?: string;
    payerEmail?: string;
    paymentMethodId?: string;
    installments?: number;
    transactionAmount?: number;
    netReceivedAmount?: number;
    totalPaidAmount?: number;
    fee?: number;
    paidAt?: Date;
  }
>;
export declare const CreatePaymentSchema: z.ZodObject<
  {
    bookingId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["ARS", "USD"]>>;
    externalReference: z.ZodString;
    description: z.ZodString;
    payerEmail: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    description?: string;
    bookingId?: string;
    amount?: number;
    currency?: "ARS" | "USD";
    externalReference?: string;
    payerEmail?: string;
  },
  {
    description?: string;
    bookingId?: string;
    amount?: number;
    currency?: "ARS" | "USD";
    externalReference?: string;
    payerEmail?: string;
  }
>;
export declare const UpdatePaymentSchema: z.ZodObject<
  {
    mercadoPagoId: z.ZodOptional<z.ZodString>;
    preferenceId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<
      z.ZodEnum<
        [
          "pending",
          "approved",
          "rejected",
          "cancelled",
          "refunded",
          "partially_refunded",
        ]
      >
    >;
    paymentMethodId: z.ZodOptional<z.ZodString>;
    installments: z.ZodOptional<z.ZodNumber>;
    transactionAmount: z.ZodOptional<z.ZodNumber>;
    netReceivedAmount: z.ZodOptional<z.ZodNumber>;
    totalPaidAmount: z.ZodOptional<z.ZodNumber>;
    fee: z.ZodOptional<z.ZodNumber>;
    paidAt: z.ZodOptional<z.ZodDate>;
  },
  "strip",
  z.ZodTypeAny,
  {
    status?:
      | "pending"
      | "approved"
      | "rejected"
      | "cancelled"
      | "refunded"
      | "partially_refunded";
    mercadoPagoId?: string;
    preferenceId?: string;
    paymentMethodId?: string;
    installments?: number;
    transactionAmount?: number;
    netReceivedAmount?: number;
    totalPaidAmount?: number;
    fee?: number;
    paidAt?: Date;
  },
  {
    status?:
      | "pending"
      | "approved"
      | "rejected"
      | "cancelled"
      | "refunded"
      | "partially_refunded";
    mercadoPagoId?: string;
    preferenceId?: string;
    paymentMethodId?: string;
    installments?: number;
    transactionAmount?: number;
    netReceivedAmount?: number;
    totalPaidAmount?: number;
    fee?: number;
    paidAt?: Date;
  }
>;
export declare const MercadoPagoPreferenceSchema: z.ZodObject<
  {
    bookingId: z.ZodString;
    customerId: z.ZodString;
    professionalId: z.ZodString;
    amount: z.ZodNumber;
    description: z.ZodString;
    payerEmail: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    description?: string;
    bookingId?: string;
    amount?: number;
    professionalId?: string;
    payerEmail?: string;
    customerId?: string;
  },
  {
    description?: string;
    bookingId?: string;
    amount?: number;
    professionalId?: string;
    payerEmail?: string;
    customerId?: string;
  }
>;
export declare const MercadoPagoWebhookSchema: z.ZodObject<
  {
    id: z.ZodString;
    live_mode: z.ZodBoolean;
    type: z.ZodString;
    date_created: z.ZodString;
    application_id: z.ZodString;
    user_id: z.ZodString;
    version: z.ZodString;
    api_version: z.ZodString;
    action: z.ZodString;
    data: z.ZodObject<
      {
        id: z.ZodString;
      },
      "strip",
      z.ZodTypeAny,
      {
        id?: string;
      },
      {
        id?: string;
      }
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    type?: string;
    id?: string;
    data?: {
      id?: string;
    };
    version?: string;
    action?: string;
    user_id?: string;
    live_mode?: boolean;
    date_created?: string;
    application_id?: string;
    api_version?: string;
  },
  {
    type?: string;
    id?: string;
    data?: {
      id?: string;
    };
    version?: string;
    action?: string;
    user_id?: string;
    live_mode?: boolean;
    date_created?: string;
    application_id?: string;
    api_version?: string;
  }
>;
export declare const CommissionCalculationSchema: z.ZodObject<
  {
    amount: z.ZodNumber;
    commissionRate: z.ZodNumber;
    platformFee: z.ZodNumber;
    professionalNet: z.ZodNumber;
  },
  "strip",
  z.ZodTypeAny,
  {
    amount?: number;
    commissionRate?: number;
    platformFee?: number;
    professionalNet?: number;
  },
  {
    amount?: number;
    commissionRate?: number;
    platformFee?: number;
    professionalNet?: number;
  }
>;
export declare const MarketplacePaymentItemSchema: z.ZodObject<
  {
    title: z.ZodString;
    quantity: z.ZodDefault<z.ZodNumber>;
    unit_price: z.ZodNumber;
    category_id: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    title?: string;
    description?: string;
    quantity?: number;
    unit_price?: number;
    category_id?: string;
  },
  {
    title?: string;
    description?: string;
    quantity?: number;
    unit_price?: number;
    category_id?: string;
  }
>;
export declare const MarketplaceSplitSchema: z.ZodObject<
  {
    amount: z.ZodNumber;
    fee_amount: z.ZodNumber;
    collector: z.ZodObject<
      {
        id: z.ZodNumber;
      },
      "strip",
      z.ZodTypeAny,
      {
        id?: number;
      },
      {
        id?: number;
      }
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    amount?: number;
    fee_amount?: number;
    collector?: {
      id?: number;
    };
  },
  {
    amount?: number;
    fee_amount?: number;
    collector?: {
      id?: number;
    };
  }
>;
export declare const MarketplacePreferenceRequestSchema: z.ZodObject<
  {
    bookingId: z.ZodString;
    customerId: z.ZodString;
    professionalId: z.ZodString;
    professionalMPUserId: z.ZodNumber;
    amount: z.ZodNumber;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    payerEmail: z.ZodOptional<z.ZodString>;
    platformCommissionRate: z.ZodDefault<z.ZodNumber>;
    backUrls: z.ZodOptional<
      z.ZodObject<
        {
          success: z.ZodString;
          failure: z.ZodString;
          pending: z.ZodString;
        },
        "strip",
        z.ZodTypeAny,
        {
          success?: string;
          pending?: string;
          failure?: string;
        },
        {
          success?: string;
          pending?: string;
          failure?: string;
        }
      >
    >;
    autoReturn: z.ZodOptional<z.ZodDefault<z.ZodEnum<["approved", "all"]>>>;
    maxInstallments: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    title?: string;
    description?: string;
    bookingId?: string;
    amount?: number;
    professionalId?: string;
    payerEmail?: string;
    customerId?: string;
    professionalMPUserId?: number;
    platformCommissionRate?: number;
    backUrls?: {
      success?: string;
      pending?: string;
      failure?: string;
    };
    autoReturn?: "all" | "approved";
    maxInstallments?: number;
  },
  {
    title?: string;
    description?: string;
    bookingId?: string;
    amount?: number;
    professionalId?: string;
    payerEmail?: string;
    customerId?: string;
    professionalMPUserId?: number;
    platformCommissionRate?: number;
    backUrls?: {
      success?: string;
      pending?: string;
      failure?: string;
    };
    autoReturn?: "all" | "approved";
    maxInstallments?: number;
  }
>;
export declare const MarketplacePreferenceResponseSchema: z.ZodObject<
  {
    id: z.ZodString;
    init_point: z.ZodString;
    sandbox_init_point: z.ZodString;
    external_reference: z.ZodString;
    collector_id: z.ZodNumber;
    marketplace_fee: z.ZodNumber;
    total_amount: z.ZodNumber;
    professional_amount: z.ZodNumber;
    platform_fee: z.ZodNumber;
    preference_data: z.ZodRecord<z.ZodString, z.ZodAny>;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    init_point?: string;
    sandbox_init_point?: string;
    external_reference?: string;
    collector_id?: number;
    marketplace_fee?: number;
    total_amount?: number;
    professional_amount?: number;
    platform_fee?: number;
    preference_data?: Record<string, any>;
  },
  {
    id?: string;
    init_point?: string;
    sandbox_init_point?: string;
    external_reference?: string;
    collector_id?: number;
    marketplace_fee?: number;
    total_amount?: number;
    professional_amount?: number;
    platform_fee?: number;
    preference_data?: Record<string, any>;
  }
>;
export declare const TestCardPaymentSchema: z.ZodObject<
  {
    bookingId: z.ZodString;
    amount: z.ZodNumber;
    cardNumber: z.ZodString;
    expirationMonth: z.ZodString;
    expirationYear: z.ZodString;
    cvv: z.ZodString;
    cardHolderName: z.ZodString;
    payerEmail: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    bookingId?: string;
    amount?: number;
    payerEmail?: string;
    cardNumber?: string;
    expirationMonth?: string;
    expirationYear?: string;
    cvv?: string;
    cardHolderName?: string;
  },
  {
    bookingId?: string;
    amount?: number;
    payerEmail?: string;
    cardNumber?: string;
    expirationMonth?: string;
    expirationYear?: string;
    cvv?: string;
    cardHolderName?: string;
  }
>;
export declare const PaymentEventSchema: z.ZodObject<
  {
    id: z.ZodString;
    paymentId: z.ZodString;
    eventType: z.ZodString;
    action: z.ZodOptional<z.ZodString>;
    apiVersion: z.ZodOptional<z.ZodString>;
    dataId: z.ZodOptional<z.ZodString>;
    dateCreated: z.ZodDate;
    rawData: z.ZodRecord<z.ZodString, z.ZodAny>;
    processed: z.ZodDefault<z.ZodBoolean>;
    processedAt: z.ZodOptional<z.ZodDate>;
    error: z.ZodOptional<z.ZodString>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    error?: string;
    action?: string;
    createdAt?: Date;
    updatedAt?: Date;
    paymentId?: string;
    eventType?: string;
    apiVersion?: string;
    dataId?: string;
    dateCreated?: Date;
    rawData?: Record<string, any>;
    processed?: boolean;
    processedAt?: Date;
  },
  {
    id?: string;
    error?: string;
    action?: string;
    createdAt?: Date;
    updatedAt?: Date;
    paymentId?: string;
    eventType?: string;
    apiVersion?: string;
    dataId?: string;
    dateCreated?: Date;
    rawData?: Record<string, any>;
    processed?: boolean;
    processedAt?: Date;
  }
>;
export declare const CreatePaymentEventSchema: z.ZodObject<
  {
    paymentId: z.ZodOptional<z.ZodString>;
    eventType: z.ZodString;
    action: z.ZodOptional<z.ZodString>;
    apiVersion: z.ZodOptional<z.ZodString>;
    dataId: z.ZodOptional<z.ZodString>;
    dateCreated: z.ZodDate;
    rawData: z.ZodRecord<z.ZodString, z.ZodAny>;
  },
  "strip",
  z.ZodTypeAny,
  {
    action?: string;
    paymentId?: string;
    eventType?: string;
    apiVersion?: string;
    dataId?: string;
    dateCreated?: Date;
    rawData?: Record<string, any>;
  },
  {
    action?: string;
    paymentId?: string;
    eventType?: string;
    apiVersion?: string;
    dataId?: string;
    dateCreated?: Date;
    rawData?: Record<string, any>;
  }
>;
export declare const ConversationSchema: z.ZodObject<
  {
    id: z.ZodString;
    bookingId: z.ZodString;
    clientId: z.ZodString;
    professionalId: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
    lastMessageAt: z.ZodOptional<z.ZodDate>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    bookingId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    professionalId?: string;
    clientId?: string;
    lastMessageAt?: Date;
  },
  {
    id?: string;
    bookingId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    professionalId?: string;
    clientId?: string;
    lastMessageAt?: Date;
  }
>;
export declare const CreateConversationSchema: z.ZodObject<
  {
    bookingId: z.ZodString;
    clientId: z.ZodString;
    professionalId: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    bookingId?: string;
    professionalId?: string;
    clientId?: string;
  },
  {
    bookingId?: string;
    professionalId?: string;
    clientId?: string;
  }
>;
export declare const MessageTypeEnum: z.ZodEnum<
  ["text", "image", "file", "system"]
>;
export declare const MessageSchema: z.ZodObject<
  {
    id: z.ZodString;
    conversationId: z.ZodString;
    senderId: z.ZodString;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["text", "image", "file", "system"]>>;
    fileUrl: z.ZodOptional<z.ZodString>;
    fileName: z.ZodOptional<z.ZodString>;
    fileSize: z.ZodOptional<z.ZodNumber>;
    isRead: z.ZodDefault<z.ZodBoolean>;
    readAt: z.ZodOptional<z.ZodDate>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    type?: "image" | "text" | "file" | "system";
    id?: string;
    content?: string;
    createdAt?: Date;
    updatedAt?: Date;
    conversationId?: string;
    senderId?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    isRead?: boolean;
    readAt?: Date;
  },
  {
    type?: "image" | "text" | "file" | "system";
    id?: string;
    content?: string;
    createdAt?: Date;
    updatedAt?: Date;
    conversationId?: string;
    senderId?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    isRead?: boolean;
    readAt?: Date;
  }
>;
export declare const CreateMessageSchema: z.ZodObject<
  {
    conversationId: z.ZodString;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["text", "image", "file", "system"]>>;
    fileUrl: z.ZodOptional<z.ZodString>;
    fileName: z.ZodOptional<z.ZodString>;
    fileSize: z.ZodOptional<z.ZodNumber>;
  },
  "strip",
  z.ZodTypeAny,
  {
    type?: "image" | "text" | "file" | "system";
    content?: string;
    conversationId?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  },
  {
    type?: "image" | "text" | "file" | "system";
    content?: string;
    conversationId?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }
>;
export declare const MessageViewSchema: z.ZodObject<
  {
    id: z.ZodString;
    conversationId: z.ZodString;
    senderId: z.ZodString;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["text", "image", "file", "system"]>>;
    fileUrl: z.ZodOptional<z.ZodString>;
    fileName: z.ZodOptional<z.ZodString>;
    fileSize: z.ZodOptional<z.ZodNumber>;
    isRead: z.ZodDefault<z.ZodBoolean>;
    readAt: z.ZodOptional<z.ZodDate>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  } & {
    sender: z.ZodObject<
      Omit<
        {
          id: z.ZodString;
          email: z.ZodString;
          name: z.ZodString;
          avatar: z.ZodOptional<z.ZodString>;
          isActive: z.ZodDefault<z.ZodBoolean>;
          role: z.ZodDefault<z.ZodEnum<["client", "professional", "admin"]>>;
        } & {
          createdAt: z.ZodDate;
          updatedAt: z.ZodDate;
        },
        "updatedAt"
      > & {
        profile: z.ZodOptional<z.ZodAny>;
      },
      "strip",
      z.ZodTypeAny,
      {
        name?: string;
        profile?: any;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        createdAt?: Date;
        avatar?: string;
        isActive?: boolean;
      },
      {
        name?: string;
        profile?: any;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        createdAt?: Date;
        avatar?: string;
        isActive?: boolean;
      }
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    type?: "image" | "text" | "file" | "system";
    id?: string;
    content?: string;
    createdAt?: Date;
    updatedAt?: Date;
    conversationId?: string;
    senderId?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    isRead?: boolean;
    readAt?: Date;
    sender?: {
      name?: string;
      profile?: any;
      id?: string;
      role?: "professional" | "client" | "admin";
      email?: string;
      createdAt?: Date;
      avatar?: string;
      isActive?: boolean;
    };
  },
  {
    type?: "image" | "text" | "file" | "system";
    id?: string;
    content?: string;
    createdAt?: Date;
    updatedAt?: Date;
    conversationId?: string;
    senderId?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    isRead?: boolean;
    readAt?: Date;
    sender?: {
      name?: string;
      profile?: any;
      id?: string;
      role?: "professional" | "client" | "admin";
      email?: string;
      createdAt?: Date;
      avatar?: string;
      isActive?: boolean;
    };
  }
>;
export declare const ReviewSchema: z.ZodObject<
  {
    id: z.ZodString;
    bookingId: z.ZodString;
    clientId: z.ZodString;
    professionalId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
    isPublic: z.ZodDefault<z.ZodBoolean>;
    response: z.ZodOptional<z.ZodString>;
    respondedAt: z.ZodOptional<z.ZodDate>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    rating?: number;
    bookingId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    professionalId?: string;
    clientId?: string;
    comment?: string;
    isPublic?: boolean;
    response?: string;
    respondedAt?: Date;
  },
  {
    id?: string;
    rating?: number;
    bookingId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    professionalId?: string;
    clientId?: string;
    comment?: string;
    isPublic?: boolean;
    response?: string;
    respondedAt?: Date;
  }
>;
export declare const CreateReviewSchema: z.ZodObject<
  {
    bookingId: z.ZodString;
    professionalId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    rating?: number;
    bookingId?: string;
    professionalId?: string;
    comment?: string;
  },
  {
    rating?: number;
    bookingId?: string;
    professionalId?: string;
    comment?: string;
  }
>;
export declare const UpdateReviewSchema: z.ZodObject<
  {
    comment: z.ZodOptional<z.ZodString>;
    isPublic: z.ZodOptional<z.ZodBoolean>;
  },
  "strip",
  z.ZodTypeAny,
  {
    comment?: string;
    isPublic?: boolean;
  },
  {
    comment?: string;
    isPublic?: boolean;
  }
>;
export declare const CreateReviewResponseSchema: z.ZodObject<
  {
    response: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    response?: string;
  },
  {
    response?: string;
  }
>;
export declare const ReviewViewSchema: z.ZodObject<
  {
    id: z.ZodString;
    bookingId: z.ZodString;
    clientId: z.ZodString;
    professionalId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
    isPublic: z.ZodDefault<z.ZodBoolean>;
    response: z.ZodOptional<z.ZodString>;
    respondedAt: z.ZodOptional<z.ZodDate>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  } & {
    client: z.ZodObject<
      Omit<
        {
          id: z.ZodString;
          email: z.ZodString;
          name: z.ZodString;
          avatar: z.ZodOptional<z.ZodString>;
          isActive: z.ZodDefault<z.ZodBoolean>;
          role: z.ZodDefault<z.ZodEnum<["client", "professional", "admin"]>>;
        } & {
          createdAt: z.ZodDate;
          updatedAt: z.ZodDate;
        },
        "updatedAt"
      > & {
        profile: z.ZodOptional<z.ZodAny>;
      },
      "strip",
      z.ZodTypeAny,
      {
        name?: string;
        profile?: any;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        createdAt?: Date;
        avatar?: string;
        isActive?: boolean;
      },
      {
        name?: string;
        profile?: any;
        id?: string;
        role?: "professional" | "client" | "admin";
        email?: string;
        createdAt?: Date;
        avatar?: string;
        isActive?: boolean;
      }
    >;
    booking: z.ZodObject<
      {
        serviceDescription: z.ZodString;
        scheduledAt: z.ZodDate;
      },
      "strip",
      z.ZodTypeAny,
      {
        serviceDescription?: string;
        scheduledAt?: Date;
      },
      {
        serviceDescription?: string;
        scheduledAt?: Date;
      }
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    id?: string;
    client?: {
      name?: string;
      profile?: any;
      id?: string;
      role?: "professional" | "client" | "admin";
      email?: string;
      createdAt?: Date;
      avatar?: string;
      isActive?: boolean;
    };
    rating?: number;
    bookingId?: string;
    booking?: {
      serviceDescription?: string;
      scheduledAt?: Date;
    };
    createdAt?: Date;
    updatedAt?: Date;
    professionalId?: string;
    clientId?: string;
    comment?: string;
    isPublic?: boolean;
    response?: string;
    respondedAt?: Date;
  },
  {
    id?: string;
    client?: {
      name?: string;
      profile?: any;
      id?: string;
      role?: "professional" | "client" | "admin";
      email?: string;
      createdAt?: Date;
      avatar?: string;
      isActive?: boolean;
    };
    rating?: number;
    bookingId?: string;
    booking?: {
      serviceDescription?: string;
      scheduledAt?: Date;
    };
    createdAt?: Date;
    updatedAt?: Date;
    professionalId?: string;
    clientId?: string;
    comment?: string;
    isPublic?: boolean;
    response?: string;
    respondedAt?: Date;
  }
>;
export declare const NotificationTypeEnum: z.ZodEnum<
  [
    "booking_created",
    "booking_confirmed",
    "booking_cancelled",
    "booking_reminder",
    "payment_received",
    "payment_failed",
    "new_message",
    "review_received",
    "profile_updated",
    "system",
  ]
>;
export declare const NotificationSchema: z.ZodObject<
  {
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodEnum<
      [
        "booking_created",
        "booking_confirmed",
        "booking_cancelled",
        "booking_reminder",
        "payment_received",
        "payment_failed",
        "new_message",
        "review_received",
        "profile_updated",
        "system",
      ]
    >;
    title: z.ZodString;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    isRead: z.ZodDefault<z.ZodBoolean>;
    readAt: z.ZodOptional<z.ZodDate>;
    actionUrl: z.ZodOptional<z.ZodString>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    type?:
      | "booking_created"
      | "system"
      | "booking_confirmed"
      | "booking_cancelled"
      | "booking_reminder"
      | "payment_received"
      | "payment_failed"
      | "new_message"
      | "review_received"
      | "profile_updated";
    id?: string;
    title?: string;
    data?: Record<string, any>;
    message?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
    isRead?: boolean;
    readAt?: Date;
    actionUrl?: string;
  },
  {
    type?:
      | "booking_created"
      | "system"
      | "booking_confirmed"
      | "booking_cancelled"
      | "booking_reminder"
      | "payment_received"
      | "payment_failed"
      | "new_message"
      | "review_received"
      | "profile_updated";
    id?: string;
    title?: string;
    data?: Record<string, any>;
    message?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId?: string;
    isRead?: boolean;
    readAt?: Date;
    actionUrl?: string;
  }
>;
export declare const CreateNotificationSchema: z.ZodObject<
  {
    userId: z.ZodString;
    type: z.ZodEnum<
      [
        "booking_created",
        "booking_confirmed",
        "booking_cancelled",
        "booking_reminder",
        "payment_received",
        "payment_failed",
        "new_message",
        "review_received",
        "profile_updated",
        "system",
      ]
    >;
    title: z.ZodString;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    actionUrl: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    type?:
      | "booking_created"
      | "system"
      | "booking_confirmed"
      | "booking_cancelled"
      | "booking_reminder"
      | "payment_received"
      | "payment_failed"
      | "new_message"
      | "review_received"
      | "profile_updated";
    title?: string;
    data?: Record<string, any>;
    message?: string;
    userId?: string;
    actionUrl?: string;
  },
  {
    type?:
      | "booking_created"
      | "system"
      | "booking_confirmed"
      | "booking_cancelled"
      | "booking_reminder"
      | "payment_received"
      | "payment_failed"
      | "new_message"
      | "review_received"
      | "profile_updated";
    title?: string;
    data?: Record<string, any>;
    message?: string;
    userId?: string;
    actionUrl?: string;
  }
>;
export declare const UpdateNotificationSchema: z.ZodObject<
  {
    isRead: z.ZodBoolean;
    readAt: z.ZodOptional<z.ZodDate>;
  },
  "strip",
  z.ZodTypeAny,
  {
    isRead?: boolean;
    readAt?: Date;
  },
  {
    isRead?: boolean;
    readAt?: Date;
  }
>;
export declare const CommissionTypeEnum: z.ZodEnum<["percentage", "fixed"]>;
export declare const CommissionRuleSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["percentage", "fixed"]>;
    value: z.ZodNumber;
    minAmount: z.ZodOptional<z.ZodNumber>;
    maxAmount: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    validFrom: z.ZodOptional<z.ZodDate>;
    validUntil: z.ZodOptional<z.ZodDate>;
  } & {
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    value?: number;
    type?: "fixed" | "percentage";
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    minAmount?: number;
    maxAmount?: number;
    validFrom?: Date;
    validUntil?: Date;
  },
  {
    name?: string;
    value?: number;
    type?: "fixed" | "percentage";
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    minAmount?: number;
    maxAmount?: number;
    validFrom?: Date;
    validUntil?: Date;
  }
>;
export declare const CreateCommissionRuleSchema: z.ZodObject<
  {
    name: z.ZodString;
    type: z.ZodEnum<["percentage", "fixed"]>;
    value: z.ZodNumber;
    minAmount: z.ZodOptional<z.ZodNumber>;
    maxAmount: z.ZodOptional<z.ZodNumber>;
    validFrom: z.ZodOptional<z.ZodDate>;
    validUntil: z.ZodOptional<z.ZodDate>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    value?: number;
    type?: "fixed" | "percentage";
    minAmount?: number;
    maxAmount?: number;
    validFrom?: Date;
    validUntil?: Date;
  },
  {
    name?: string;
    value?: number;
    type?: "fixed" | "percentage";
    minAmount?: number;
    maxAmount?: number;
    validFrom?: Date;
    validUntil?: Date;
  }
>;
export declare const UpdateCommissionRuleSchema: z.ZodObject<
  {
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["percentage", "fixed"]>>;
    value: z.ZodOptional<z.ZodNumber>;
    minAmount: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    maxAmount: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    validFrom: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    validUntil: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name?: string;
    value?: number;
    type?: "fixed" | "percentage";
    minAmount?: number;
    maxAmount?: number;
    validFrom?: Date;
    validUntil?: Date;
  },
  {
    name?: string;
    value?: number;
    type?: "fixed" | "percentage";
    minAmount?: number;
    maxAmount?: number;
    validFrom?: Date;
    validUntil?: Date;
  }
>;
export declare const ApiResponseSchema: z.ZodObject<
  {
    success: z.ZodBoolean;
    message: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodUnknown>;
    errors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  },
  "strip",
  z.ZodTypeAny,
  {
    data?: unknown;
    message?: string;
    success?: boolean;
    errors?: string[];
  },
  {
    data?: unknown;
    message?: string;
    success?: boolean;
    errors?: string[];
  }
>;
export declare const PaginatedResponseSchema: z.ZodObject<
  {
    success: z.ZodBoolean;
    data: z.ZodArray<z.ZodUnknown, "many">;
    pagination: z.ZodObject<
      {
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasNext: z.ZodBoolean;
        hasPrev: z.ZodBoolean;
      },
      "strip",
      z.ZodTypeAny,
      {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
      },
      {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
      }
    >;
    message: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    data?: unknown[];
    message?: string;
    success?: boolean;
    pagination?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
      hasNext?: boolean;
      hasPrev?: boolean;
    };
  },
  {
    data?: unknown[];
    message?: string;
    success?: boolean;
    pagination?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
      hasNext?: boolean;
      hasPrev?: boolean;
    };
  }
>;
export declare const SearchFiltersSchema: z.ZodObject<
  {
    query: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    locationId: z.ZodOptional<z.ZodString>;
    minRate: z.ZodOptional<z.ZodNumber>;
    maxRate: z.ZodOptional<z.ZodNumber>;
    rating: z.ZodOptional<z.ZodNumber>;
    isVerified: z.ZodOptional<z.ZodBoolean>;
    languages: z.ZodOptional<z.ZodArray<z.ZodEnum<["es", "en", "pt"]>, "many">>;
    sortBy: z.ZodDefault<
      z.ZodEnum<["relevance", "rating", "price_low", "price_high", "newest"]>
    >;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
  },
  "strip",
  z.ZodTypeAny,
  {
    page?: number;
    limit?: number;
    rating?: number;
    sortBy?: "rating" | "relevance" | "price_low" | "price_high" | "newest";
    query?: string;
    maxRate?: number;
    minRate?: number;
    isVerified?: boolean;
    languages?: ("es" | "en" | "pt")[];
    locationId?: string;
    categoryId?: string;
  },
  {
    page?: number;
    limit?: number;
    rating?: number;
    sortBy?: "rating" | "relevance" | "price_low" | "price_high" | "newest";
    query?: string;
    maxRate?: number;
    minRate?: number;
    isVerified?: boolean;
    languages?: ("es" | "en" | "pt")[];
    locationId?: string;
    categoryId?: string;
  }
>;
export declare const HealthCheckSchema: z.ZodObject<
  {
    status: z.ZodLiteral<"ok">;
    timestamp: z.ZodString;
    uptime: z.ZodNumber;
    version: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    version?: string;
    status?: "ok";
    timestamp?: string;
    uptime?: number;
  },
  {
    version?: string;
    status?: "ok";
    timestamp?: string;
    uptime?: number;
  }
>;
export type User = z.infer<typeof UserSchema>;
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type UserView = z.infer<typeof UserViewSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequestSchema>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type CreateProfileDTO = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>;
export type ProfessionalProfile = z.infer<typeof ProfessionalProfileSchema>;
export type CreateProfessionalProfileDTO = z.infer<
  typeof CreateProfessionalProfileSchema
>;
export type UpdateProfessionalProfileDTO = z.infer<
  typeof UpdateProfessionalProfileSchema
>;
export type ProfessionalProfileView = z.infer<
  typeof ProfessionalProfileViewSchema
>;
export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;
export type CreateServiceCategoryDTO = z.infer<
  typeof CreateServiceCategorySchema
>;
export type UpdateServiceCategoryDTO = z.infer<
  typeof UpdateServiceCategorySchema
>;
export type ServiceTag = z.infer<typeof ServiceTagSchema>;
export type CreateServiceTagDTO = z.infer<typeof CreateServiceTagSchema>;
export type UpdateServiceTagDTO = z.infer<typeof UpdateServiceTagSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type CreateLocationDTO = z.infer<typeof CreateLocationSchema>;
export type UpdateLocationDTO = z.infer<typeof UpdateLocationSchema>;
export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
export type CreateAvailabilitySlotDTO = z.infer<
  typeof CreateAvailabilitySlotSchema
>;
export type UpdateAvailabilitySlotDTO = z.infer<
  typeof UpdateAvailabilitySlotSchema
>;
export type Booking = z.infer<typeof BookingSchema>;
export type CreateBookingDTO = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingDTO = z.infer<typeof UpdateBookingSchema>;
export type BookingView = z.infer<typeof BookingViewSchema>;
export type BookingStatus = z.infer<typeof BookingStatusEnum>;
export type Payment = z.infer<typeof PaymentSchema>;
export type CreatePaymentDTO = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentDTO = z.infer<typeof UpdatePaymentSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
export type PaymentEvent = z.infer<typeof PaymentEventSchema>;
export type CreatePaymentEventDTO = z.infer<typeof CreatePaymentEventSchema>;
export type MercadoPagoPreferenceDTO = z.infer<
  typeof MercadoPagoPreferenceSchema
>;
export type MercadoPagoWebhookDTO = z.infer<typeof MercadoPagoWebhookSchema>;
export type CommissionCalculationDTO = z.infer<
  typeof CommissionCalculationSchema
>;
export type MarketplacePaymentItem = z.infer<
  typeof MarketplacePaymentItemSchema
>;
export type MarketplaceSplit = z.infer<typeof MarketplaceSplitSchema>;
export type MarketplacePreferenceRequest = z.infer<
  typeof MarketplacePreferenceRequestSchema
>;
export type MarketplacePreferenceResponse = z.infer<
  typeof MarketplacePreferenceResponseSchema
>;
export type TestCardPayment = z.infer<typeof TestCardPaymentSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type CreateConversationDTO = z.infer<typeof CreateConversationSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type CreateMessageDTO = z.infer<typeof CreateMessageSchema>;
export type MessageView = z.infer<typeof MessageViewSchema>;
export type MessageType = z.infer<typeof MessageTypeEnum>;
export type Review = z.infer<typeof ReviewSchema>;
export type CreateReviewDTO = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewDTO = z.infer<typeof UpdateReviewSchema>;
export type CreateReviewResponseDTO = z.infer<
  typeof CreateReviewResponseSchema
>;
export type ReviewView = z.infer<typeof ReviewViewSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotificationDTO = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationDTO = z.infer<typeof UpdateNotificationSchema>;
export type NotificationType = z.infer<typeof NotificationTypeEnum>;
export type CommissionRule = z.infer<typeof CommissionRuleSchema>;
export type CreateCommissionRuleDTO = z.infer<
  typeof CreateCommissionRuleSchema
>;
export type UpdateCommissionRuleDTO = z.infer<
  typeof UpdateCommissionRuleSchema
>;
export type CommissionType = z.infer<typeof CommissionTypeEnum>;
export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
};
export type PaginatedResponse<T = unknown> = {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
};
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
export type HealthCheck = z.infer<typeof HealthCheckSchema>;
//# sourceMappingURL=schemas.d.ts.map
