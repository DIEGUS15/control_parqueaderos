import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import emailRouter from "./routes/email.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/email", emailRouter);

app.listen(PORT, () => {
  console.log(`Servicio de email corriendo en http://localhost:${PORT}`);
});
