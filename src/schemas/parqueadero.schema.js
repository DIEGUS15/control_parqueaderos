import { z } from "zod";

export const createParqueaderoSchema = z.object({
  nombre: z
    .string({
      required_error: "Nombre is required",
    })
    .min(3, {
      message: "Nombre must be at least 3 characters",
    })
    .max(100, {
      message: "Nombre must be less than 100 characters",
    }),
  direccion: z
    .string({
      required_error: "Dirección is required",
    })
    .min(10, {
      message: "Dirección must be at least 10 characters",
    })
    .max(200, {
      message: "Dirección must be less than 200 characters",
    }),
  capacidad: z
    .number({
      required_error: "Capacidad is required",
    })
    .int({
      message: "Capacidad must be an integer",
    })
    .min(1, {
      message: "Capacidad must be at least 1",
    })
    .max(1000, {
      message: "Capacidad must be less than 1000",
    }),
  costoPorHora: z
    .number({
      required_error: "Costo por hora is required",
    })
    .positive({
      message: "Costo por hora must be positive",
    })
    .max(999999, {
      message: "Costo por hora is too high",
    }),
  socioId: z
    .number({
      required_error: "Socio ID is required",
    })
    .int({
      message: "Socio ID must be an integer",
    })
    .positive({
      message: "Socio ID must be positive",
    }),
  activo: z.boolean().optional(), // Opcional, por defecto será true
});

export const updateParqueaderoSchema = z
  .object({
    nombre: z
      .string()
      .min(3, {
        message: "Nombre must be at least 3 characters",
      })
      .max(100, {
        message: "Nombre must be less than 100 characters",
      })
      .optional(),
    direccion: z
      .string()
      .min(10, {
        message: "Dirección must be at least 10 characters",
      })
      .max(200, {
        message: "Dirección must be less than 200 characters",
      })
      .optional(),
    capacidad: z
      .number()
      .int({
        message: "Capacidad must be an integer",
      })
      .min(1, {
        message: "Capacidad must be at least 1",
      })
      .max(1000, {
        message: "Capacidad must be less than 1000",
      })
      .optional(),
    costoPorHora: z
      .number()
      .positive({
        message: "Costo por hora must be positive",
      })
      .max(999999, {
        message: "Costo por hora is too high",
      })
      .optional(),
    socioId: z
      .number()
      .int({
        message: "Socio ID must be an integer",
      })
      .positive({
        message: "Socio ID must be positive",
      })
      .optional(),
    activo: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
