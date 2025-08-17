import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import parqueaderoRoutes from "./routes/parqueadero.routes.js";
import vehiculoRoutes from "./routes/vehiculo.routes.js";
import indicadoresRoutes from "./routes/indicadores.routes.js";

import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api/parqueadero", parqueaderoRoutes);
app.use("/api/vehiculo", vehiculoRoutes);
app.use("/api/indicadores", indicadoresRoutes);

app.use(errorHandler);

export default app;
