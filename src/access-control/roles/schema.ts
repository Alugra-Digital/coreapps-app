import { z } from "zod";

export const roleFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  permissionKeys: z.array(z.string()),
  isActive: z.boolean(),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
