import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Please provide a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character."),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long."),
    email: z.string().trim().email("Please provide a valid email address."),
  }),
});
