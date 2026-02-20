import { z } from "zod";

const coverInfoSchema = z.object({
  jobOffer: z.string().min(1, "Penawaran pekerjaan/jasa is required"),
  companyName: z.string().min(1, "Company name is required"),
  proposalMonth: z.string().min(1, "Proposal month is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

const clientInfoSchema = z.object({
  clientId: z.string().optional(),
  clientName: z.string().min(1, "Client name is required"),
  contactPerson: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const proposalItemSchema = z.object({
  number: z.number().min(1),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.001, "Quantity must be greater than 0"),
  volume: z.string().min(1, "Volume is required"),
  unitPrice: z.number().min(0, "Unit price must be >= 0"),
  totalPrice: z.number().min(0),
});

const documentApprovalSchema = z.object({
  place: z.string().min(1, "Place is required"),
  date: z.string().min(1, "Date is required"),
  signerName: z.string().min(1, "Signer name is required"),
  signerPosition: z.string().min(1, "Signer position is required"),
  signatureUrl: z.string().url().optional().or(z.literal("")),
});

export const proposalPenawaranFormSchema = z.object({
  coverInfo: coverInfoSchema,
  proposalNumber: z.string().min(1, "Proposal number is required"),
  clientInfo: clientInfoSchema,
  clientBackground: z.string().optional(),
  offeredSolution: z.string().optional(),
  workingMethod: z.string().optional(),
  timeline: z.string().optional(),
  portfolio: z.string().optional(),
  items: z.array(proposalItemSchema).min(1, "At least one item is required"),
  totalEstimatedCost: z.number().min(0, "Total cost must be >= 0"),
  totalEstimatedCostInWords: z.string().min(1, "Total in words is required"),
  currency: z.string().min(1, "Currency is required"),
  scopeOfWork: z.array(z.string()),
  termsAndConditions: z.array(z.string()),
  notes: z.string().optional(),
  documentApproval: documentApprovalSchema,
  status: z.enum(["draft", "sent", "accepted", "rejected"]),
});

export type ProposalPenawaranFormValues = z.infer<typeof proposalPenawaranFormSchema>;
