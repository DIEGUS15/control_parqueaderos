import { Router } from "express";
import {
  createParqueadero,
  getAllParqueaderos,
  getParqueaderoById,
  getParqueaderosBySocio,
  getParqueaderosStats,
  updateParqueadero,
  toggleParqueaderoStatus,
  getMyParqueaderos,
  deleteParqueadero,
} from "../controllers/parqueadero.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import {
  createParqueaderoSchema,
  updateParqueaderoSchema,
} from "../schemas/parqueadero.schema.js";
import {
  adminOnly,
  adminAndSocio,
  socioOnly,
} from "../middlewares/checkRole.js";

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

router.get("/mis-parqueaderos", authRequired, socioOnly, getMyParqueaderos);

//Parqueaderos pertenecientes a un socio
router.get("/socio/:socioId", authRequired, adminOnly, getParqueaderosBySocio);

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

//Eliminar parqueadero
router.delete("/:id", authRequired, adminOnly, deleteParqueadero);

export default router;
