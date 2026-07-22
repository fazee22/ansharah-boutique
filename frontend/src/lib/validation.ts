import { z } from "zod";

/**
 * Shared Zod primitives. Compose these into feature-specific schemas
 * (e.g. `LoginSchema`, `AddressSchema`) instead of redefining common
 * rules like email or phone validation in multiple places.
 */
export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number");

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid phone number");

export const nonEmptyString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);
