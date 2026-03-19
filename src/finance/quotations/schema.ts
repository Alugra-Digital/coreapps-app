import { z } from "zod";

const lineItemSchema = z.object({
  number: z.number(),
  description: z.string().min(1, "Description required"),
  quantity: z.number().min(0),
  unit: z.string().min(1, "Unit required"),
  unitPrice: z.number().min(0),
  subtotal: z.number().min(0),
});

export const quotationFormSchema = z.object({
  quotationNumber: z.string().min(1, "Quotation number required"),
  quotationDate: z.string().min(1, "Date required"),
  validUntil: z.string().optional(),
  clientId: z.string().min(1, "Client required"),
  clientName: z.string().min(1, "Client name required"),
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  serviceOffered: z.string().min(1, "Service offered required"),
  quotationMonth: z.string().min(1, "Quotation month required"),
  lineItems: z.array(lineItemSchema).min(1, "At least one item required"),
  subtotal: z.number().min(0),
  taxAmount: z.number().min(0),
  taxTypeId: z.string().optional(),
  grandTotal: z.number().min(0),
  paymentTerms: z.string().optional(),
  validityPeriod: z.string().optional(),
  termsConditions: z.string().optional(),
  status: z.enum(["draft", "sent", "accepted", "rejected", "expired", "negotiation"]),
});

export type QuotationFormValues = z.infer<typeof quotationFormSchema>;
