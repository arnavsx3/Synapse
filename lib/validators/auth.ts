import { z } from "zod";

export const signupSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(6),
  name: z.string().optional(),
});


export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1),
});