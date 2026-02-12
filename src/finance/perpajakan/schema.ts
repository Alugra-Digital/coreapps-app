import { z } from "zod";

export const taxCategorySchema = z.enum(["output_tax", "withholding_tax"]);
export const applicableDocumentSchema = z.enum(["invoice", "po", "bast"]);

export const taxTypeFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  rate: z.number().min(0, "Rate must be >= 0").max(100, "Rate must be <= 100"),
  category: taxCategorySchema,
  description: z.string().min(1, "Description is required"),
  regulation: z.string().optional(),
  applicableDocuments: z.array(applicableDocumentSchema).min(1, "Select at least one applicable document"),
  documentUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type TaxTypeFormValues = z.infer<typeof taxTypeFormSchema>;
