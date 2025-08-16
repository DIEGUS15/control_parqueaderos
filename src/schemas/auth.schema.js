import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export const registerSchema = z.object({
  fullname: z
    .string({
      required_error: "Full name is required",
    })
    .min(2, {
      message: "Full name must be at least 2 characters",
    })
    .max(100, {
      message: "Full name must be less than 100 characters",
    }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(50, {
      message: "Password must be less than 50 characters",
    }),
});
