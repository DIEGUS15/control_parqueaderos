import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { adminOnly } from "../middlewares/checkRole.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);

router.post(
  "/register",
  authRequired,
  adminOnly,
  validateSchema(registerSchema),
  register
);

export default router;
