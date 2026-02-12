import { z } from "zod";

export const inventoryItemFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(0, "Quantity must be >= 0"),
  price: z.number().min(0, "Price must be >= 0"),
});

export type InventoryItemFormValues = z.infer<typeof inventoryItemFormSchema>;
