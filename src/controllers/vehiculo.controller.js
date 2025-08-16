import prisma from "../db.js";

export const registrarIngreso = async (req, res) => {
  const { placa, parqueaderoId } = req.body;
  const userId = req.user.id;

  try {
    const parqueadero = await prisma.parqueadero.findFirst({
      where: {
        id: parqueaderoId,
        socioId: userId,
        activo: true,
      },
    });

    if (!parqueadero) {
      return res.status(404).json({
        message:
          "No se ha encontrado el parqueadero o no tiene permiso para acceder a él.",
      });
    }

    const vehiculoExistente = await prisma.registroVehiculo.findFirst({
      where: {
        placa: placa,
        activo: true,
      },
    });

    if (vehiculoExistente) {
      return res.status(400).json({
        mensaje:
          "No se puede Registrar Ingreso, ya existe la placa en este u otro parqueadero",
      });
    }

    const vehiculosActivos = await prisma.registroVehiculo.count({
      where: {
        parqueaderoId: parqueaderoId,
        activo: true,
      },
    });

    if (vehiculosActivos >= parqueadero.capacidad) {
      return res.status(400).json({
        message: "El parqueadero ha alcanzado su capacidad máxima.",
      });
    }

    const nuevoRegistro = await prisma.registroVehiculo.create({
      data: {
        placa,
        parqueaderoId,
      },
    });

    res.status(201).json({
      id: nuevoRegistro.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registrarSalida = async (req, res) => {
  const { placa, parqueaderoId } = req.body;
  const userId = req.user.id;

  try {
    const parqueadero = await prisma.parqueadero.findFirst({
      where: {
        id: parqueaderoId,
        socioId: userId,
      },
    });

    if (!parqueadero) {
      return res.status(404).json({
        message:
          "No se ha encontrado el parqueadero o no tiene permiso para acceder a él.",
      });
    }

    const vehiculoEnParqueadero = await prisma.registroVehiculo.findFirst({
      where: {
        placa: placa,
        parqueaderoId: parqueaderoId,
        activo: true,
      },
    });

    if (!vehiculoEnParqueadero) {
      return res.status(400).json({
        mensaje:
          "No se puede Registrar Salida, no existe la placa en el parqueadero",
      });
    }

    const fechaSalida = new Date();

    await prisma.$transaction(async (prisma) => {
      await prisma.historialVehiculo.create({
        data: {
          placa: vehiculoEnParqueadero.placa,
          parqueaderoId: vehiculoEnParqueadero.parqueaderoId,
          fechaIngreso: vehiculoEnParqueadero.fechaIngreso,
          fechaSalida: fechaSalida,
        },
      });

      await prisma.registroVehiculo.update({
        where: { id: vehiculoEnParqueadero.id },
        data: {
          activo: false,
          fechaSalida: fechaSalida,
        },
      });
    });

    res.status(200).json({
      mensaje: "Salida registrada",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener vehiculos en un parqueadero en especifico
export const getVehiculos = async (req, res) => {
  const { parqueaderoId } = req.params;

  try {
    const parqueadero = await prisma.parqueadero.findUnique({
      where: { id: parseInt(parqueaderoId) },
    });

    if (!parqueadero) {
      return res.status(404).json({ message: "Parqueadero not found" });
    }

    const vehiculos = await prisma.registroVehiculo.findMany({
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

    res.status(200).json(vehiculos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener los vehiculos vinculados a un socio
export const getVehiculosSocio = async (req, res) => {
  const { parqueaderoId } = req.params;
  const userId = req.user.id;

  try {
    const parqueadero = await prisma.parqueadero.findFirst({
      where: {
        id: parseInt(parqueaderoId),
        socioId: userId,
      },
    });

    if (!parqueadero) {
      return res.status(404).json({
        message:
          "No se ha encontrado el parqueadero o no tiene permiso para acceder a él.",
      });
    }

    const vehiculos = await prisma.registroVehiculo.findMany({
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

    res.status(200).json(vehiculos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
