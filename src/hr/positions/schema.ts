import { z } from "zod";

export const positionFormSchema = z.object({
  name: z.string().min(1, "Nama jabatan wajib diisi"),
  code: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type PositionFormValues = z.infer<typeof positionFormSchema>;
