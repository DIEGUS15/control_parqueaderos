import { IndicadoresService } from "../services/indicadoresService.js";

const indicadoresService = new IndicadoresService();

export const getTop10VehiculosFrecuentes = async (req, res, next) => {
  try {
    const resultado = await indicadoresService.getTop10VehiculosFrecuentes();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const getTop10VehiculosFrecuentesParqueadero = async (
  req,
  res,
  next
) => {
  try {
    const resultado =
      await indicadoresService.getTop10VehiculosFrecuentesParqueadero(
        req.params.parqueaderoId
      );
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const getVehiculosPrimeraVez = async (req, res, next) => {
  try {
    const resultado = await indicadoresService.getVehiculosPrimeraVez(
      req.params.parqueaderoId
    );
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const getGananciasParqueadero = async (req, res, next) => {
  try {
    const resultado = await indicadoresService.getGananciasParqueadero(
      req.params.parqueaderoId,
      req.user.id
    );
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const buscarVehiculosPorPlaca = async (req, res, next) => {
  try {
    const resultado = await indicadoresService.buscarVehiculosPorPlaca(
      req.query
    );
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const buscarVehiculosPorPlacaParqueadero = async (req, res, next) => {
  try {
    const resultado =
      await indicadoresService.buscarVehiculosPorPlacaParqueadero(
        req.params.parqueaderoId,
        req.query
      );
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
