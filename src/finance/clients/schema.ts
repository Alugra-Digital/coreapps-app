import { z } from "zod";

export const clientFormSchema = z.object({
  name: z.string().min(1, "Nama client wajib diisi"),
  companyName: z.string().min(1, "Nama perusahaan wajib diisi"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.union([z.string().email("Invalid email"), z.literal("")]).optional(),
  npwp: z.string().optional(),
  picName: z.string().optional(),
  picPosition: z.string().optional(),
  picContact: z.string().optional(),
  isActive: z.boolean(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
