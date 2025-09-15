import {
  DayOfWeek,
  PrismaClient,
  SlotType,
  UserRole,
  UserStatus,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Limpiar datos existentes en orden correcto (respetando foreign keys)
  await prisma.paymentEvent.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.professionalProfile.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.location.deleteMany();
  await prisma.commissionRule.deleteMany();

  console.log("✅ Cleared existing data");

  // 1. Crear categorías de servicio
  const categories = await Promise.all([
    prisma.serviceCategory.create({
      data: {
        name: "Psicología",
        slug: "psicologia",
        description: "Servicios de apoyo psicológico y terapia",
        order: 1,
      },
    }),
    prisma.serviceCategory.create({
      data: {
        name: "Nutrición",
        slug: "nutricion",
        description: "Asesoramiento nutricional y planes alimentarios",
        order: 2,
      },
    }),
    prisma.serviceCategory.create({
      data: {
        name: "Fitness",
        slug: "fitness",
        description: "Entrenamiento personal y planes de ejercicio",
        order: 3,
      },
    }),
    prisma.serviceCategory.create({
      data: {
        name: "Coaching",
        slug: "coaching",
        description: "Coaching personal y profesional",
        order: 4,
      },
    }),
  ]);

  console.log("✅ Created service categories:", categories.length);

  // 2. Crear ubicaciones
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        province: "Buenos Aires",
        city: "CABA",
        latitude: -34.6118,
        longitude: -58.396,
      },
    }),
    prisma.location.create({
      data: {
        province: "Buenos Aires",
        city: "La Plata",
        latitude: -34.9205,
        longitude: -57.9536,
      },
    }),
    prisma.location.create({
      data: {
        province: "Córdoba",
        city: "Córdoba",
        latitude: -31.4201,
        longitude: -64.1888,
      },
    }),
  ]);

  console.log("✅ Created locations:", locations.length);

  // 3. Hash para passwords
  const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

  // 4. Crear usuarios cliente
  const clientUser = await prisma.user.create({
    data: {
      email: "cliente@ejemplo.com",
      password: hashPassword("password123"),
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: "Juan",
          lastName: "Pérez",
          phone: "+5491123456789",
        },
      },
    },
  });

  console.log("✅ Created client user");

  // 5. Crear usuarios profesionales
  await prisma.user.create({
    data: {
      email: "psicologo@ejemplo.com",
      password: hashPassword("password123"),
      role: UserRole.PROFESSIONAL,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: "María",
          lastName: "González",
          phone: "+5491198765432",
          avatar:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
        },
      },
      professionalProfile: {
        create: {
          bio: "Psicóloga clínica especializada en terapia cognitivo-conductual",
          description: `Psicóloga clínica con más de 8 años de experiencia en el tratamiento de ansiedad, depresión y trastornos del estado del ánimo.

Especializada en terapia cognitivo-conductual (TCC) y mindfulness. Mi enfoque se centra en proporcionar herramientas prácticas para el manejo del estrés y la mejora del bienestar emocional.

Sesiones online y presenciales disponibles.`,
          pricePerSession: 15000,
          standardDuration: 50,
          serviceCategoryId: categories[0].id, // Psicología
          locationId: locations[0].id, // CABA
          tags: ["ansiedad", "depresión", "tcc", "mindfulness", "adultos"],
          rating: 4.8,
          reviewCount: 24,
          isVerified: true,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "nutricionista@ejemplo.com",
      password: hashPassword("password123"),
      role: UserRole.PROFESSIONAL,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: "Carlos",
          lastName: "Rodríguez",
          phone: "+5491134567890",
          avatar:
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
        },
      },
      professionalProfile: {
        create: {
          bio: "Nutricionista especializado en planes personalizados y deportivo",
          description: `Licenciado en Nutrición con especialización en nutrición deportiva y clínica.

Trabajo con personas que buscan mejorar su composición corporal, rendir mejor en el deporte, o simplemente adoptar hábitos alimentarios más saludables.

Mis planes son 100% personalizados y se adaptan a tu estilo de vida, gustos y objetivos específicos.`,
          pricePerSession: 12000,
          standardDuration: 45,
          serviceCategoryId: categories[1].id, // Nutrición
          locationId: locations[1].id, // La Plata
          tags: [
            "planes-nutricionales",
            "deportivo",
            "pérdida-peso",
            "masa-muscular",
          ],
          rating: 4.9,
          reviewCount: 18,
          isVerified: true,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "trainer@ejemplo.com",
      password: hashPassword("password123"),
      role: UserRole.PROFESSIONAL,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: "Ana",
          lastName: "Martínez",
          phone: "+5491145678901",
          avatar:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        },
      },
      professionalProfile: {
        create: {
          bio: "Personal Trainer especializada en funcional y fuerza",
          description: `Personal Trainer certificada con 5 años de experiencia en entrenamiento funcional, fuerza y acondicionamiento físico.

Especializada en:
• Entrenamiento funcional
• Desarrollo de fuerza
• Pérdida de peso
• Preparación física general

Sesiones presenciales y online. Planes de entrenamiento personalizados según tus objetivos.`,
          pricePerSession: 8000,
          standardDuration: 60,
          serviceCategoryId: categories[2].id, // Fitness
          locationId: locations[2].id, // Córdoba
          tags: [
            "funcional",
            "fuerza",
            "cardio",
            "peso-libre",
            "principiantes",
          ],
          rating: 4.7,
          reviewCount: 31,
          isVerified: false, // No verificado aún
        },
      },
    },
  });
  console.log("✅ Created professional users:", 3);

  // 6. Crear admin
  await prisma.user.create({
    data: {
      email: "admin@profesional.com",
      password: hashPassword("admin123"),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: "Admin",
          lastName: "Sistema",
        },
      },
    },
  });

  console.log("✅ Created admin user");

  // 7. Crear slots de disponibilidad para profesionales
  const professionalProfiles = await prisma.professionalProfile.findMany();

  for (const prof of professionalProfiles) {
    // Slots recurrentes de lunes a viernes
    const weekdaySlots = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
    ];

    for (const day of weekdaySlots) {
      await prisma.availabilitySlot.create({
        data: {
          professionalId: prof.id,
          type: SlotType.RECURRING,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "17:00",
          isActive: true,
        },
      });
    }

    // Algunos slots específicos para fines de semana
    const nextSaturday = new Date();
    nextSaturday.setDate(
      nextSaturday.getDate() + ((6 - nextSaturday.getDay()) % 7)
    );

    await prisma.availabilitySlot.create({
      data: {
        professionalId: prof.id,
        type: SlotType.ONE_TIME,
        specificDate: nextSaturday,
        specificStart: new Date(nextSaturday.getTime() + 10 * 60 * 60 * 1000), // 10:00
        specificEnd: new Date(nextSaturday.getTime() + 14 * 60 * 60 * 1000), // 14:00
        isActive: true,
      },
    });
  }

  console.log("✅ Created availability slots");

  // 8. Crear reglas de comisión
  await prisma.commissionRule.create({
    data: {
      percentage: 15.0, // 15% de comisión
      fixedFee: 100, // $100 fee fijo
      isActive: true,
    },
  });

  console.log("✅ Created commission rules");

  // 9. Crear algunas notificaciones para el cliente
  await prisma.notification.create({
    data: {
      userId: clientUser.id,
      type: "SYSTEM_NOTIFICATION",
      title: "Bienvenido a Profesional",
      message:
        "Tu cuenta ha sido creada exitosamente. ¡Explora y encuentra a tu profesional ideal!",
      payload: { welcome: true },
    },
  });

  console.log("✅ Created notifications");

  console.log("🎉 Database seed completed successfully!");
  console.log("📊 Summary:");
  console.log(`- Service Categories: ${categories.length}`);
  console.log(`- Locations: ${locations.length}`);
  console.log("- Users: 1 client + 3 professionals + 1 admin = 5 total");
  console.log("- Availability slots created for all professionals");
  console.log("- Commission rules configured");

  console.log("\n🔐 Test credentials:");
  console.log("Client: cliente@ejemplo.com / password123");
  console.log("Professional 1: psicologo@ejemplo.com / password123");
  console.log("Professional 2: nutricionista@ejemplo.com / password123");
  console.log("Professional 3: trainer@ejemplo.com / password123");
  console.log("Admin: admin@profesional.com / admin123");
}

main()
  .catch(e => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
