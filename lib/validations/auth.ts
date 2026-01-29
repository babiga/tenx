import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

// Base password schema for reuse
const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Individual signup schema (client-side)
export const individualSignupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[+]?[0-9]{8,15}$/, "Please enter a valid phone number"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "You must accept the terms and conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Company signup schema (client-side)
export const companySignupSchema = z
  .object({
    companyName: z
      .string()
      .min(1, "Company name is required")
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be less than 100 characters"),
    companyLegalNo: z
      .string()
      .min(1, "Company registration number is required")
      .min(5, "Registration number must be at least 5 characters")
      .max(20, "Registration number must be less than 20 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[+]?[0-9]{8,15}$/, "Please enter a valid phone number"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "You must accept the terms and conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// API signup schema (server-side) - discriminated union
export const signupApiSchema = z.discriminatedUnion("userType", [
  z.object({
    userType: z.literal("INDIVIDUAL"),
    firstName: z.string().min(1).min(2).max(50),
    lastName: z.string().min(1).min(2).max(50),
    email: z.string().min(1).email(),
    phone: z.string().min(1).regex(/^[+]?[0-9]{8,15}$/),
    password: passwordSchema,
  }),
  z.object({
    userType: z.literal("CORPORATE"),
    companyName: z.string().min(1).min(2).max(100),
    companyLegalNo: z.string().min(1).min(5).max(20),
    email: z.string().min(1).email(),
    phone: z.string().min(1).regex(/^[+]?[0-9]{8,15}$/),
    password: passwordSchema,
  }),
]);

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type IndividualSignupFormData = z.infer<typeof individualSignupSchema>;
export type CompanySignupFormData = z.infer<typeof companySignupSchema>;
export type SignupApiData = z.infer<typeof signupApiSchema>;
