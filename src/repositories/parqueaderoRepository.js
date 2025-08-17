import prisma from "../db.js";
import { Parqueadero } from "../entities/parqueadero.js";

export class ParqueaderoRepository {
  constructor() {
    this.includeOptions = {
      socio: {
        select: {
          id: true,
          fullname: true,
          email: true,
          role: true,
        },
      },
    };
  }

  async findAll(filters) {
    const parqueaderosData = await prisma.parqueadero.findMany({
      where: filters.where,
      skip: filters.skip,
      take: filters.limit,
      include: this.includeOptions,
      orderBy: {
        createdAt: "desc",
      },
    });

    return parqueaderosData.map((data) => new Parqueadero(data));
  }

  async count(where = {}) {
    return await prisma.parqueadero.count({ where });
  }

  async findById(id) {
    const parqueaderoData = await prisma.parqueadero.findUnique({
      where: { id: parseInt(id) },
      include: {
        socio: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    return parqueaderoData ? new Parqueadero(parqueaderoData) : null;
  }

  async findBySocioId(socioId, activo) {
    const where = { socioId: parseInt(socioId) };

    if (activo !== undefined) {
      where.activo = activo === "true";
    }

    const parqueaderosData = await prisma.parqueadero.findMany({
      where,
      include: {
        socio: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return parqueaderosData.map((data) => new Parqueadero(data));
  }

  async findByName(nombre, excludeId = null) {
    const where = { nombre };

    if (excludeId) {
      where.id = { not: parseInt(excludeId) };
    }

    const parqueaderoData = await prisma.parqueadero.findFirst({ where });
    return parqueaderoData ? new Parqueadero(parqueaderoData) : null;
  }

  async countActiveVehicles(parqueaderoId) {
    return await prisma.registroVehiculo.count({
      where: {
        parqueaderoId: parseInt(parqueaderoId),
        activo: true, // Vehículos que están actualmente dentro
      },
    });
  }

  async create(createData) {
    const parqueaderoData = await prisma.parqueadero.create({
      data: createData,
      include: this.includeOptions,
    });

    return new Parqueadero(parqueaderoData);
  }

  async update(id, updateData) {
    const parqueaderoData = await prisma.parqueadero.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: this.includeOptions,
    });

    return new Parqueadero(parqueaderoData);
  }

  async getStatistics() {
    const [
      totalParqueaderos,
      parqueaderosActivos,
      parqueaderosInactivos,
      totalCapacidad,
      sociosConParqueaderos,
    ] = await Promise.all([
      prisma.parqueadero.count(),
      prisma.parqueadero.count({ where: { activo: true } }),
      prisma.parqueadero.count({ where: { activo: false } }),
      prisma.parqueadero.aggregate({
        _sum: { capacidad: true },
      }),
      prisma.parqueadero.groupBy({
        by: ["socioId"],
        _count: { _all: true },
      }),
    ]);

    return {
      totalParqueaderos,
      parqueaderosActivos,
      parqueaderosInactivos,
      totalCapacidad,
      sociosConParqueaderos,
    };
  }
}
