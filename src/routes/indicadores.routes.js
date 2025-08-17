import { Router } from "express";
import {
  getTop10VehiculosFrecuentes,
  getTop10VehiculosFrecuentesParqueadero,
  getVehiculosPrimeraVez,
  getGananciasParqueadero,
  buscarVehiculosPorPlaca,
  buscarVehiculosPorPlacaParqueadero,
} from "../controllers/indicadores.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { adminAndSocio, socioOnly } from "../middlewares/checkRole.js";

const router = Router();

// Top 10 vehículos más frecuentes (todos los parqueaderos)
router.get(
  "/top-vehiculos",
  authRequired,
  adminAndSocio,
  getTop10VehiculosFrecuentes
);

// Top 10 vehículos más frecuentes de un parqueadero específico
router.get(
  "/top-vehiculos/:parqueaderoId",
  authRequired,
  adminAndSocio,
  getTop10VehiculosFrecuentesParqueadero
);

//Vehiculos registrados por primera vez
router.get(
  "/vehiculos-primera-vez/:parqueaderoId",
  authRequired,
  adminAndSocio,
  getVehiculosPrimeraVez
);

//Obtener ganancias del parqueadero
router.get(
  "/ganancias/:parqueaderoId",
  authRequired,
  socioOnly, // Solo socios pueden ver ganancias
  getGananciasParqueadero
);

// Buscar vehículos por coincidencia en placa (todos los parqueaderos)
router.get("/buscar", authRequired, adminAndSocio, buscarVehiculosPorPlaca);

// Buscar vehículos por coincidencia en placa en un parqueadero específico
router.get(
  "/buscar/:parqueaderoId",
  authRequired,
  adminAndSocio,
  buscarVehiculosPorPlacaParqueadero
);

export default router;
