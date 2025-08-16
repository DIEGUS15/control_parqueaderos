import { Router } from "express";
import {
  registrarIngreso,
  registrarSalida,
  getVehiculos,
  getVehiculosSocio,
} from "../controllers/vehiculo.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import {
  registrarIngresoSchema,
  registrarSalidaSchema,
} from "../schemas/vehiculo.schema.js";
import { adminOnly, socioOnly } from "../middlewares/checkRole.js";

const router = Router();

// Registrar ingreso de vehículo
router.post(
  "/ingreso",
  authRequired,
  socioOnly,
  validateSchema(registrarIngresoSchema),
  registrarIngreso
);

router.post(
  "/salida",
  authRequired,
  socioOnly,
  validateSchema(registrarSalidaSchema),
  registrarSalida
);

// Obtener vehículos de un parqueadero específico
router.get(
  "/parqueadero/:parqueaderoId",
  authRequired,
  adminOnly,
  getVehiculos
);

// Obtener vehículos de un parqueadero del socio logueado
router.get(
  "/socio/parqueadero/:parqueaderoId",
  authRequired,
  socioOnly,
  getVehiculosSocio
);

export default router;
