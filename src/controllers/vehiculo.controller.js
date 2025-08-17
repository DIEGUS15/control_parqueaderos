import { VehiculoService } from "../services/vehiculoService.js";

const vehiculoService = new VehiculoService();

export const registrarIngreso = async (req, res, next) => {
  try {
    const result = await vehiculoService.registrarIngreso(
      req.body,
      req.user.id
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const registrarSalida = async (req, res, next) => {
  try {
    const result = await vehiculoService.registrarSalida(req.body, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getVehiculos = async (req, res, next) => {
  try {
    const vehiculos = await vehiculoService.getVehiculos(
      req.params.parqueaderoId
    );
    res.status(200).json(vehiculos);
  } catch (error) {
    next(error);
  }
};

export const getVehiculosSocio = async (req, res, next) => {
  try {
    const vehiculos = await vehiculoService.getVehiculosSocio(
      req.params.parqueaderoId,
      req.user.id
    );
    res.status(200).json(vehiculos);
  } catch (error) {
    next(error);
  }
};
