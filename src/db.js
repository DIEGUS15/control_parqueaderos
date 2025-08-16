import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(">>> PostgreSQL DB is connected via Prisma");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};

export default prisma;
