import { ParqueaderoService } from "../services/parqueaderoService.js";

const parqueaderoService = new ParqueaderoService();

export const getAllParqueaderos = async (req, res, next) => {
  try {
    const result = await parqueaderoService.getAllParqueaderos(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getParqueaderoById = async (req, res, next) => {
  try {
    const parqueadero = await parqueaderoService.getParqueaderoById(
      req.params.id
    );
    res.json(parqueadero);
  } catch (error) {
    next(error);
  }
};

export const getParqueaderosBySocio = async (req, res, next) => {
  try {
    const result = await parqueaderoService.getParqueaderosBySocio(
      req.params.socioId,
      req.query.activo
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getParqueaderosStats = async (req, res, next) => {
  try {
    const stats = await parqueaderoService.getParqueaderosStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const createParqueadero = async (req, res, next) => {
  try {
    const newParqueadero = await parqueaderoService.createParqueadero(req.body);
    res.status(201).json(newParqueadero);
  } catch (error) {
    next(error);
  }
};

export const updateParqueadero = async (req, res, next) => {
  try {
    const updatedParqueadero = await parqueaderoService.updateParqueadero(
      req.params.id,
      req.body
    );
    res.json(updatedParqueadero);
  } catch (error) {
    next(error);
  }
};

export const toggleParqueaderoStatus = async (req, res, next) => {
  try {
    const result = await parqueaderoService.toggleParqueaderoStatus(
      req.params.id
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyParqueaderos = async (req, res, next) => {
  try {
    // El socioId se obtiene del token JWT (req.user viene del middleware authRequired)
    const socioId = req.user.id;

    // Usar el mismo servicio pero con el ID del socio autenticado
    const result = await parqueaderoService.getParqueaderosBySocio(
      socioId,
      req.query.activo
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Agregar este método a tu parqueadero.controller.js

export const deleteParqueadero = async (req, res, next) => {
  try {
    const result = await parqueaderoService.deleteParqueadero(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
