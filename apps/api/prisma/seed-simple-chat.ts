import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Creando usuarios de prueba para chat...");

  // Solo crear usuarios para login y JWT
  const user1 = await prisma.user.upsert({
    where: { email: "cliente@test.com" },
    update: {},
    create: {
      email: "cliente@test.com",
      password: "$2y$10$JdthbplYTQTMh8WtUN.3ReIHPsINwqU22H5GenoRQmK/ucUyLhlJS", // "test123"
      role: "CLIENT",
      status: "ACTIVE",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "profesional@test.com" },
    update: {},
    create: {
      email: "profesional@test.com",
      password: "$2y$10$JdthbplYTQTMh8WtUN.3ReIHPsINwqU22H5GenoRQmK/ucUyLhlJS", // "test123"
      role: "PROFESSIONAL",
      status: "ACTIVE",
    },
  });

  // Crear profiles básicos
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

  console.log("✅ Usuarios de prueba creados:");
  console.log("👤 Cliente:", user1.email, "- ID:", user1.id);
  console.log("👤 Profesional:", user2.email, "- ID:", user2.id);
  console.log("");
  console.log("🔑 Para login, usa:");
  console.log("  Email: cliente@test.com | profesional@test.com");
  console.log("  Password: test123");
  console.log("");
  console.log("💬 Para probar chat, necesitarás crear un booking manualmente");
}

main()
  .catch(e => {
    console.error("❌ Error creando datos de prueba:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
