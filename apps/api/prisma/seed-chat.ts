import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Creando datos de prueba para chat...");

  // Crear usuarios de prueba (password simple para pruebas)
  const user1 = await prisma.user.upsert({
    where: { email: "cliente@test.com" },
    update: {},
    create: {
      id: "1",
      email: "cliente@test.com",
      name: "Cliente Test",
      password: "password123", // En desarrollo podemos usar texto plano para pruebas
      status: "ACTIVE",
      role: "CLIENT",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "profesional@test.com" },
    update: {},
    create: {
      id: "2",
      email: "profesional@test.com",
      name: "Profesional Test",
      password: "password123",
      status: "ACTIVE",
      role: "PROFESSIONAL",
    },
  });

  // Crear perfiles
  await prisma.profile.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      firstName: "Cliente",
      lastName: "Test",
      avatar: null,
    },
  });

  await prisma.profile.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      firstName: "Profesional",
      lastName: "Test",
      avatar: null,
    },
  });

  // Crear booking de prueba directo (sin dependencies complejas)
  const booking = await prisma.booking.upsert({
    where: { id: "test-booking-123" },
    update: {},
    create: {
      id: "test-booking-123",
      clientId: user1.id,
      professionalId: user2.id,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
      duration: 60,
      totalAmount: 50.0,
      status: "CONFIRMED",
      location: "Online - Chat Test",
      notes: "Booking para probar el sistema de chat",
      // Vamos a omitir campos que requieren foreign keys complejas
    },
  });

  console.log("✅ Datos de prueba creados:");
  console.log("👤 Cliente:", user1.email, "- ID:", user1.id);
  console.log("👤 Profesional:", user2.email, "- ID:", user2.id);
  console.log("📅 Booking:", booking.id);
  console.log("");
  console.log("🔑 Para probar JWT, usa estos user IDs:");
  console.log("Cliente ID:", user1.id);
  console.log("Profesional ID:", user2.id);
  console.log("Booking ID:", booking.id);
}

main()
  .catch(e => {
    console.error("❌ Error creando datos de prueba:", e);
    console.log(
      "ℹ️  Puede que necesites crear algunos datos dependientes manualmente"
    );
    console.log("ℹ️  Para el chat solo necesitas users válidos y un booking");
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
