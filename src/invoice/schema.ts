import { z } from "zod";

const billingPicSchema = z.object({
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

export const invoiceFormSchema = z.object({
  companyInfo: z.object({
    letterhead: z.string().optional(),
    companyName: z.string().min(1, "Company name is required"),
    logoUrl: z.string().url().optional().or(z.literal("")),
    address: z.string().min(1, "Address is required"),
    phone: z.string().min(1, "Phone is required"),
  }),
  invoiceInfo: z.object({
    invoiceName: z.string().min(1, "Invoice name is required"),
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    invoiceDate: z.string().min(1, "Invoice date is required"),
    taxInvoice: z.string().optional(),
    dueDate: z.string().min(1, "Due date is required"),
  }),
  billingInfo: z.object({
    companyName: z.string().min(1, "Billing company name is required"),
    address: z.string().min(1, "Billing address is required"),
    phone: z.string().min(1, "Billing phone is required"),
    pic: billingPicSchema,
  }),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),
  paymentInfo: z.object({
    bank: z.string().min(1, "Bank is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    branch: z.string().min(1, "Branch is required"),
    accountName: z.string().min(1, "Account name is required"),
    npwp: z.string().optional(),
  }),
  approval: z.object({
    position: z.string().min(1, "Approval position is required"),
    name: z.string().min(1, "Approval name is required"),
    signatureUrl: z.string().url().optional().or(z.literal("")),
  }),
  notes: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
