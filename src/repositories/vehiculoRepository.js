import prisma from "../db.js";
import { RegistroVehiculo } from "../entities/registroVehiculo.js";
import { HistorialVehiculo } from "../entities/historialVehiculo.js";

export class VehiculoRepository {
  async findActiveByPlaca(placa) {
    const vehiculoData = await prisma.registroVehiculo.findFirst({
      where: {
        placa: placa,
        activo: true,
      },
    });

    return vehiculoData ? new RegistroVehiculo(vehiculoData) : null;
  }

  async findActiveByPlacaAndParqueadero(placa, parqueaderoId) {
    const vehiculoData = await prisma.registroVehiculo.findFirst({
      where: {
        placa: placa,
        parqueaderoId: parqueaderoId,
        activo: true,
      },
    });

    return vehiculoData ? new RegistroVehiculo(vehiculoData) : null;
  }

  async countActiveInParqueadero(parqueaderoId) {
    return await prisma.registroVehiculo.count({
      where: {
        parqueaderoId: parqueaderoId,
        activo: true,
      },
    });
  }

  async findActiveByParqueadero(parqueaderoId) {
    const vehiculosData = await prisma.registroVehiculo.findMany({
      where: {
        parqueaderoId: parseInt(parqueaderoId),
        activo: true,
      },
      select: {
        id: true,
        placa: true,
        fechaIngreso: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        fechaIngreso: "desc",
      },
    });

    return vehiculosData.map((data) => new RegistroVehiculo(data));
  }

  async createRegistroIngreso(registroData) {
    const vehiculoData = await prisma.registroVehiculo.create({
      data: registroData,
    });

    return new RegistroVehiculo(vehiculoData);
  }

  async createHistorialAndUpdateRegistro(
    registroVehiculo,
    fechaSalida,
    montoTotal
  ) {
    return await prisma.$transaction(async (prisma) => {
      const historialData = await prisma.historialVehiculo.create({
        data: {
          placa: registroVehiculo.placa,
          parqueaderoId: registroVehiculo.parqueaderoId,
          fechaIngreso: registroVehiculo.fechaIngreso,
          fechaSalida: fechaSalida,
          montoTotal: montoTotal,
        },
      });

      await prisma.registroVehiculo.update({
        where: { id: registroVehiculo.id },
        data: {
          activo: false,
          fechaSalida: fechaSalida,
        },
      });

      return new HistorialVehiculo(historialData);
    });
  }
}
