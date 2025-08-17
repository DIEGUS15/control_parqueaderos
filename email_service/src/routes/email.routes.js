import { Router } from "express";
import { sendEmail } from "../controllers/email.controller.js";

const router = Router();

router.post("/send", sendEmail);

export default router;
