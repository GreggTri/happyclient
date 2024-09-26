import 'server-only'
import { z } from "zod";

export const RegisterFormSchema = z.object({
    email: z.string().email("Please enter a valid email").trim(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must be no more than 64 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
        .trim(),
});


export const LoginFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(1, { message: 'Password field must not be empty.' }),
});

export type AuthFormState =
    {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined | null;

export const updateProfileNameForm = z.object({
  firstName: z.string()
  .max(64, "Name must be less than 64 letters")
  //.regex(/^(null|[a-zA-Z]+)$/,"Name must only contains letters")
  .trim(),
  lastName: z.string()
  .max(64, "Name must be less than 64 letters")
  //.regex(/^(null|[a-zA-Z]+)$/,"Name must only contains letters" )
  .trim()
});

export type UpdateProfileFormState =
    {
      errors?: {
        firstName?: string[];
        lastName?: string[];
      };
      message?: string;
    }
  | undefined | null;


export type SessionPayload = {
  userId: string | null;
  expiresAt: Date;
  isAdmin: boolean;
  tenantId: string;
  stripeSubscriptionId: string | null;
};
