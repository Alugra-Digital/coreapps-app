import { z } from "zod";

const vendorPicSchema = z.object({
  name: z.string().min(1, "PIC name is required"),
  position: z.string().min(1, "Position is required"),
  contact: z.string().optional(),
});

const lineItemSchema = z.object({
  number: z.number().min(1),
  itemDescription: z.string().min(1, "Item description is required"),
  quantity: z.number().min(0.001, "Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().min(0, "Price must be >= 0"),
  subtotal: z.number().min(0),
  taxRate: z.number().min(0).max(100).optional(),
  taxAmount: z.number().min(0).optional(),
  priceAfterTax: z.number().min(0).optional(),
});

export const purchaseOrderFormSchema = z.object({
  companyInfo: z.object({
    letterhead: z.string().optional(),
    companyName: z.string().min(1, "Company name is required"),
    logoUrl: z.string().url().optional().or(z.literal("")),
    address: z.string().min(1, "Address is required"),
    phone: z.string().min(1, "Phone is required"),
  }),
  orderInfo: z.object({
    poDate: z.string().min(1, "PO date is required"),
    poNumber: z.string().min(1, "PO number is required"),
    docReference: z.string().optional(),
  }),
  vendorInfo: z.object({
    vendorName: z.string().min(1, "Vendor name is required"),
    phone: z.string().min(1, "Vendor phone is required"),
    pic: vendorPicSchema,
  }),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),
  paymentProcedure: z.string().optional(),
  otherTerms: z.string().optional(),
  approval: z.object({
    position: z.string().min(1, "Approval position is required"),
    name: z.string().min(1, "Approval name is required"),
    signatureUrl: z.string().url().optional().or(z.literal("")),
  }),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;
