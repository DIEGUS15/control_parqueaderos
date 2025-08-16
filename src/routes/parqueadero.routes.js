import { Router } from "express";
import {
  createParqueadero,
  getAllParqueaderos,
  getParqueaderoById,
  getParqueaderosBySocio,
  getParqueaderosStats,
  updateParqueadero,
  toggleParqueaderoStatus,
} from "../controllers/parqueadero.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import {
  createParqueaderoSchema,
  updateParqueaderoSchema,
} from "../schemas/parqueadero.schema.js";
import { adminOnly, adminAndSocio } from "../middlewares/checkRole.js";

const router = Router();

//Crear parqueadero
router.post(
  "/",
  authRequired,
  adminOnly,
  validateSchema(createParqueaderoSchema),
  createParqueadero
);

//Obtener todos los parqueaderos
router.get("/", authRequired, adminOnly, getAllParqueaderos);

//Estadísticas
router.get("/stats", authRequired, adminOnly, getParqueaderosStats);

//Parqueaderos pertenecientes a un socio
router.get(
  "/socio/:socioId",
  authRequired,
  adminAndSocio,
  getParqueaderosBySocio
);

//Obtener parqueadero por ID
router.get("/:id", authRequired, adminOnly, getParqueaderoById);

//Actualizar parqueadero
router.put(
  "/:id",
  authRequired,
  adminOnly, // Solo admin puede actualizar
  validateSchema(updateParqueaderoSchema),
  updateParqueadero
);

//Cambiar estado activo/inactivo
router.patch("/:id/toggle", authRequired, adminOnly, toggleParqueaderoStatus);

export default router;
