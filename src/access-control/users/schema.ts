import { z } from "zod";

export const userFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  fullName: z.string().min(1, "Full name is required"),
  roleId: z.string().min(1, "Role is required"),
  password: z.string().optional(),
  isActive: z.boolean(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
