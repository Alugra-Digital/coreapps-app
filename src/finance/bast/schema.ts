import { z } from "zod";

const partySignatureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  signatureUrl: z.string().url().optional().or(z.literal("")),
});

export const bastFormSchema = z.object({
  coverInfo: z.object({
    jobOffer: z.string().min(1, "Job offer is required"),
    companyName: z.string().min(1, "Company name is required"),
    bastMonth: z.string().min(1, "BAST month is required"),
    address: z.string().min(1, "Address is required"),
    phone: z.string().min(1, "Phone is required"),
  }),
  documentInfo: z.object({
    bastNumber: z.string().min(1, "BAST number is required"),
    bastDate: z.string().min(1, "BAST date is required"),
    relatedPoOrInvoice: z.string().optional(),
  }),
  deliveringParty: partySignatureSchema,
  receivingParty: partySignatureSchema,
});

export type BASTFormValues = z.infer<typeof bastFormSchema>;
