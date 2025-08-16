import { z } from "zod";

export const registrarIngresoSchema = z.object({
  placa: z
    .string({
      required_error: "Placa is required",
    })
    .length(6, {
      message: "Placa must be exactly 6 characters",
    })
    .regex(/^[A-Za-z0-9]+$/, {
      message:
        "Placa must contain only alphanumeric characters (no special characters or ñ)",
    })
    .transform((placa) => placa.toUpperCase()), // Convertir a mayúsculas
  parqueaderoId: z
    .number({
      required_error: "Parqueadero ID is required",
    })
    .int({
      message: "Parqueadero ID must be an integer",
    })
    .positive({
      message: "Parqueadero ID must be positive",
    }),
});

export const registrarSalidaSchema = z.object({
  placa: z
    .string({
      required_error: "Placa is required",
    })
    .length(6, {
      message: "Placa must be exactly 6 characters",
    })
    .regex(/^[A-Za-z0-9]+$/, {
      message:
        "Placa must contain only alphanumeric characters (no special characters or ñ)",
    })
    .transform((placa) => placa.toUpperCase()),
  parqueaderoId: z
    .number({
      required_error: "Parqueadero ID is required",
    })
    .int({
      message: "Parqueadero ID must be an integer",
    })
    .positive({
      message: "Parqueadero ID must be positive",
    }),
});
