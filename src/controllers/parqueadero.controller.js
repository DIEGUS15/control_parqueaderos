import prisma from "../db.js";

//Obtener todos los parqueaderos
export const getAllParqueaderos = async (req, res) => {
  try {
    const { activo, socioId, page = 1, limit = 10 } = req.query;

    const where = {};

    if (activo !== undefined) {
      where.activo = activo === "true";
    }

    if (socioId) {
      where.socioId = parseInt(socioId);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const parqueaderos = await prisma.parqueadero.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: {
        socio: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.parqueadero.count({ where });

    res.json({
      parqueaderos,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total,
        total_pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener parqueadero por ID
export const getParqueaderoById = async (req, res) => {
  const { id } = req.params;

  try {
    const parqueadero = await prisma.parqueadero.findUnique({
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

    if (!parqueadero) {
      return res.status(404).json({ message: "Parqueadero not found" });
    }

    res.json(parqueadero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener parqueaderos pertenecientes a un socio
export const getParqueaderosBySocio = async (req, res) => {
  const { socioId } = req.params;
  const { activo } = req.query;

  try {
    const socio = await prisma.user.findUnique({
      where: { id: parseInt(socioId) },
    });

    if (!socio) {
      return res.status(404).json({ message: "Socio not found" });
    }

    if (socio.role !== "SOCIO") {
      return res.status(400).json({ message: "User is not a SOCIO" });
    }

    const where = { socioId: parseInt(socioId) };

    if (activo !== undefined) {
      where.activo = activo === "true";
    }

    const parqueaderos = await prisma.parqueadero.findMany({
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

    res.json({
      socio: {
        id: socio.id,
        fullname: socio.fullname,
        email: socio.email,
      },
      parqueaderos,
      total: parqueaderos.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener estadísticas generales
export const getParqueaderosStats = async (req, res) => {
  try {
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

    res.json({
      statistics: {
        total_parqueaderos: totalParqueaderos,
        parqueaderos_activos: parqueaderosActivos,
        parqueaderos_inactivos: parqueaderosInactivos,
        capacidad_total: totalCapacidad._sum.capacidad || 0,
        socios_con_parqueaderos: sociosConParqueaderos.length,
      },
      socios_distribution: sociosConParqueaderos.map((item) => ({
        socio_id: item.socioId,
        cantidad_parqueaderos: item._count._all,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Crear parqueadero
export const createParqueadero = async (req, res) => {
  const {
    nombre,
    direccion,
    capacidad,
    costoPorHora,
    socioId,
    activo = true,
  } = req.body;

  try {
    const socio = await prisma.user.findUnique({
      where: { id: socioId },
    });

    if (!socio) {
      return res.status(404).json({ message: "Socio not found" });
    }

    if (socio.role !== "SOCIO") {
      return res.status(400).json({
        message:
          "El usuario debe tener el rol SOCIO para poder ser asignado a un parqueadero.",
      });
    }

    const existingParqueadero = await prisma.parqueadero.findFirst({
      where: { nombre },
    });

    if (existingParqueadero) {
      return res.status(400).json({
        message: "Ya existe un parqueadero con este nombre.",
      });
    }

    const newParqueadero = await prisma.parqueadero.create({
      data: {
        nombre,
        direccion,
        capacidad,
        costoPorHora,
        socioId,
        activo,
      },
      include: {
        socio: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({
      id: newParqueadero.id,
      nombre: newParqueadero.nombre,
      direccion: newParqueadero.direccion,
      capacidad: newParqueadero.capacidad,
      costoPorHora: newParqueadero.costoPorHora,
      activo: newParqueadero.activo,
      socio: newParqueadero.socio,
      createdAt: newParqueadero.createdAt,
      updatedAt: newParqueadero.updatedAt,
      message: "Parqueadero created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Actualizar parqueadero
export const updateParqueadero = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, capacidad, costoPorHora, socioId, activo } =
    req.body;

  try {
    const existingParqueadero = await prisma.parqueadero.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingParqueadero) {
      return res.status(404).json({ message: "Parqueadero not found" });
    }

    if (socioId && socioId !== existingParqueadero.socioId) {
      const newSocio = await prisma.user.findUnique({
        where: { id: socioId },
      });

      if (!newSocio) {
        return res.status(404).json({ message: "New socio not found" });
      }

      if (newSocio.role !== "SOCIO") {
        return res.status(400).json({
          message:
            "El usuario debe tener el rol SOCIO para poder ser asignado a un parqueadero.",
        });
      }
    }

    if (nombre && nombre !== existingParqueadero.nombre) {
      const duplicateParqueadero = await prisma.parqueadero.findFirst({
        where: {
          nombre,
          id: { not: parseInt(id) },
        },
      });

      if (duplicateParqueadero) {
        return res.status(400).json({
          message: "A parqueadero with this name already exists",
        });
      }
    }

    // Actualizar parqueadero
    const updatedParqueadero = await prisma.parqueadero.update({
      where: { id: parseInt(id) },
      data: {
        ...(nombre && { nombre }),
        ...(direccion && { direccion }),
        ...(capacidad && { capacidad }),
        ...(costoPorHora && { costoPorHora }),
        ...(socioId && { socioId }),
        ...(activo !== undefined && { activo }),
      },
      include: {
        socio: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.json({
      id: updatedParqueadero.id,
      nombre: updatedParqueadero.nombre,
      direccion: updatedParqueadero.direccion,
      capacidad: updatedParqueadero.capacidad,
      costoPorHora: updatedParqueadero.costoPorHora,
      activo: updatedParqueadero.activo,
      socio: updatedParqueadero.socio,
      createdAt: updatedParqueadero.createdAt,
      updatedAt: updatedParqueadero.updatedAt,
      message: "Parqueadero updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Cambiar estado activo/inactivo
export const toggleParqueaderoStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const existingParqueadero = await prisma.parqueadero.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingParqueadero) {
      return res.status(404).json({ message: "Parqueadero not found" });
    }

    const updatedParqueadero = await prisma.parqueadero.update({
      where: { id: parseInt(id) },
      data: { activo: !existingParqueadero.activo },
      include: {
        socio: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
    });

    res.json({
      id: updatedParqueadero.id,
      nombre: updatedParqueadero.nombre,
      activo: updatedParqueadero.activo,
      socio: updatedParqueadero.socio,
      message: `Parqueadero ${
        updatedParqueadero.activo ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
