-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'SOCIO');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'SOCIO',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."parqueaderos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "costoPorHora" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "socioId" INTEGER NOT NULL,

    CONSTRAINT "parqueaderos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."registro_vehiculos" (
    "id" SERIAL NOT NULL,
    "placa" TEXT NOT NULL,
    "parqueaderoId" INTEGER NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaSalida" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registro_vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."historial_vehiculos" (
    "id" SERIAL NOT NULL,
    "placa" TEXT NOT NULL,
    "parqueaderoId" INTEGER NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "fechaSalida" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."parqueaderos" ADD CONSTRAINT "parqueaderos_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registro_vehiculos" ADD CONSTRAINT "registro_vehiculos_parqueaderoId_fkey" FOREIGN KEY ("parqueaderoId") REFERENCES "public"."parqueaderos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."historial_vehiculos" ADD CONSTRAINT "historial_vehiculos_parqueaderoId_fkey" FOREIGN KEY ("parqueaderoId") REFERENCES "public"."parqueaderos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
