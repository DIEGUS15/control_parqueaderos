import prisma from "../db.js";

export class IndicadoresRepository {
  // Métodos para vehículos frecuentes
  async getAllHistorialPlacas() {
    return await prisma.historialVehiculo.findMany({
      select: { placa: true },
    });
  }

  async getAllRegistroPlacas() {
    return await prisma.registroVehiculo.findMany({
      select: { placa: true },
    });
  }

  async getHistorialPlacasByParqueadero(parqueaderoId) {
    return await prisma.historialVehiculo.findMany({
      where: { parqueaderoId: parseInt(parqueaderoId) },
      select: { placa: true },
    });
  }

  async getRegistroPlacasByParqueadero(parqueaderoId) {
    return await prisma.registroVehiculo.findMany({
      where: { parqueaderoId: parseInt(parqueaderoId) },
      select: { placa: true },
    });
  }

  // Métodos para vehículos primera vez
  async getVehiculosActivosByParqueadero(parqueaderoId) {
    return await prisma.registroVehiculo.findMany({
      where: {
        parqueaderoId: parseInt(parqueaderoId),
        activo: true,
      },
      select: {
        id: true,
        placa: true,
        fechaIngreso: true,
      },
    });
  }

  async getPlacasHistoricasDistinctByParqueadero(parqueaderoId) {
    return await prisma.historialVehiculo.findMany({
      where: { parqueaderoId: parseInt(parqueaderoId) },
      select: { placa: true },
      distinct: ["placa"],
    });
  }

  async getPlacasRegistroPreviasByParqueadero(parqueaderoId) {
    return await prisma.registroVehiculo.findMany({
      where: {
        parqueaderoId: parseInt(parqueaderoId),
        activo: false,
      },
      select: { placa: true },
      distinct: ["placa"],
    });
  }

  // Métodos para ganancias
  async getGananciasByParqueaderoAndDateRange(parqueaderoId, dateRange) {
    return await prisma.historialVehiculo.aggregate({
      where: {
        parqueaderoId: parseInt(parqueaderoId),
        fechaSalida: dateRange,
      },
      _sum: {
        montoTotal: true,
      },
    });
  }

  // Métodos para búsquedas
  async searchVehiculosActivos(searchTerm) {
    return await prisma.registroVehiculo.findMany({
      where: {
        placa: {
          contains: searchTerm,
          mode: "insensitive",
        },
        activo: true,
      },
      include: {
        parqueadero: {
          select: {
            id: true,
            nombre: true,
            direccion: true,
          },
        },
      },
      orderBy: {
        fechaIngreso: "desc",
      },
    });
  }

  async searchVehiculosActivosByParqueadero(parqueaderoId, searchTerm) {
    return await prisma.registroVehiculo.findMany({
      where: {
        parqueaderoId: parseInt(parqueaderoId),
        placa: {
          contains: searchTerm,
          mode: "insensitive",
        },
        activo: true,
      },
      orderBy: {
        fechaIngreso: "desc",
      },
    });
  }

  // Método para validar parqueadero con socio
  async findParqueaderoWithSocio(parqueaderoId, socioId) {
    return await prisma.parqueadero.findFirst({
      where: {
        id: parseInt(parqueaderoId),
        socioId: socioId,
      },
    });
  }

  // Método para validar parqueadero existe
  async findParqueaderoById(parqueaderoId) {
    return await prisma.parqueadero.findUnique({
      where: { id: parseInt(parqueaderoId) },
    });
  }
}
