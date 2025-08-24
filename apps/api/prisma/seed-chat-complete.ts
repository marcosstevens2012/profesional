import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Creando datos completos para chat testing...");

  // 1. Verificar que usuarios existen
  const cliente = await prisma.user.findUnique({
    where: { email: "cliente@test.com" },
  });
  const profesional = await prisma.user.findUnique({
    where: { email: "profesional@test.com" },
  });

  if (!cliente || !profesional) {
    console.error(
      "❌ Usuarios no encontrados. Ejecuta seed-simple-chat.ts primero"
    );
    return;
  }

  // 2. Crear ServiceCategory
  const category = await prisma.serviceCategory.upsert({
    where: { slug: "consultoria-test" },
    update: {},
    create: {
      name: "Consultoría Test",
      slug: "consultoria-test",
      description: "Categoría de prueba para testing",
    },
  });

  // 3. Crear Location
  const location = await prisma.location.upsert({
    where: { id: "location-test-001" },
    update: {},
    create: {
      id: "location-test-001",
      province: "Online",
      city: "Virtual",
    },
  });

  // 4. Crear ProfessionalProfile
  const professionalProfile = await prisma.professionalProfile.upsert({
    where: { userId: profesional.id },
    update: {},
    create: {
      userId: profesional.id,
      email: "profesional@test.com",
      name: "Profesional Test",
      bio: "Profesional de prueba",
      description: "Profesional para testing del sistema de chat",
      pricePerSession: 100.0,
      standardDuration: 60,
      serviceCategoryId: category.id,
      locationId: location.id,
      tags: ["test", "chat", "consulting"],
    },
  });

  // 5. Crear Booking
  const booking = await prisma.booking.upsert({
    where: { id: "chat-test-booking-001" },
    update: {},
    create: {
      id: "chat-test-booking-001",
      clientId: cliente.id,
      professionalId: professionalProfile.id,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
      duration: 60,
      price: 100.0,
      status: "CONFIRMED",
      notes: "Booking de prueba para sistema de chat",
    },
  });

  // 6. Crear Conversation (opcional, se puede crear automáticamente)
  const conversation = await prisma.conversation.upsert({
    where: { bookingId: booking.id },
    update: {},
    create: {
      bookingId: booking.id,
    },
  });

  console.log("✅ Datos completos creados:");
  console.log("👤 Cliente ID:", cliente.id);
  console.log("👤 Profesional ID:", profesional.id);
  console.log("👔 ProfessionalProfile ID:", professionalProfile.id);
  console.log("📅 Booking ID:", booking.id);
  console.log("💬 Conversation ID:", conversation.id);
  console.log("");
  console.log("🧪 Para probar chat:");
  console.log(`  GET /chat/conversations/${booking.id}/messages`);
  console.log("  WebSocket: ws://localhost:3002");
  console.log("  Booking ID para WebSocket:", booking.id);
}

main()
  .catch(e => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
