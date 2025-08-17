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
    const whereClause = {
      activo: true,
      ...filters.where,
    };

    const parqueaderos = await prisma.parqueadero.findMany({
      where: whereClause,
      include: {
        socio: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
      skip: filters.skip,
      take: filters.limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return parqueaderos.map((p) => new Parqueadero(p));
  }

  async count(whereClause) {
    const finalWhere = {
      activo: true,
      ...whereClause,
    };

    return await prisma.parqueadero.count({
      where: finalWhere,
    });
  }

  async findById(id) {
    const parqueaderoData = await prisma.parqueadero.findUnique({
      where: { id: parseInt(id), activo: true },
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
    const whereClause = {
      socioId: parseInt(socioId),
      activo: activo !== undefined ? activo === "true" : true,
    };

    const parqueaderos = await prisma.parqueadero.findMany({
      where: whereClause,
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

    return parqueaderos.map((p) => new Parqueadero(p)); // <- Agregar esta línea
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

  async findByIdIncludingInactive(id) {
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

  async findAllIncludingInactive(filters) {
    const parqueaderos = await prisma.parqueadero.findMany({
      where: filters.where,
      include: {
        socio: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
      skip: filters.skip,
      take: filters.limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return parqueaderos.map((p) => new Parqueadero(p)); // <- Agregar esta línea
  }

  async countIncludingInactive(whereClause) {
    return await prisma.parqueadero.count({
      where: whereClause,
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
