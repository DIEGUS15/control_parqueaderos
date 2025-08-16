import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de la base de datos...");

  // Verificar si el usuario admin ya existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@mail.com" },
  });

  if (existingAdmin) {
    console.log("Usuario admin ya existe, saltando creación...");
    return;
  }

  // Crear usuario ADMIN por defecto
  const adminPassword = await bcrypt.hash("admin", 10);

  const admin = await prisma.user.create({
    data: {
      fullname: "Administrador del Sistema",
      email: "admin@mail.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Usuario ADMIN creado exitosamente:");
  console.log({
    id: admin.id,
    fullname: admin.fullname,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((e) => {
    console.error("Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
