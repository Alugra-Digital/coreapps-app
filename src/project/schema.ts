import { z } from "zod";

export const projectStatusSchema = z.enum([
  "PIPELINE", "NEGOTIATION", "WON", "LOST",
  "ON_PROGRESS", "ON_HOLD", "READY_TO_CLOSE", "COMPLETED", "CANCELLED",
  "on_progress", "completed", "cancelled", // legacy
]);
export type ProjectStatusForm = z.infer<typeof projectStatusSchema>;

const projectDocumentSchema = z.object({
  url: z.string().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  uploadedAt: z.string().optional(),
});

const expenseItemSchema = z.object({
  description: z.string().min(1, "Description required"),
  date: z.string().min(1, "Date required"),
  amount: z.number().min(0, "Amount must be >= 0"),
  phase: z.enum(["PRE_COST", "ON_GOING"]),
});

export type ExpenseItemForm = z.infer<typeof expenseItemSchema>;

export const projectFormSchema = z.object({
  identity: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    namaProject: z.string().min(1, "Project name is required"),
    clientId: z.string().min(1, "Client is required"),
    clientName: z.string().min(1, "Client name is required"),
    scopeProject: z.string().optional(),
    price: z.number().min(0).optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    projectManagerId: z.string().optional(),
    projectManagerName: z.string().optional(),
    picId: z.string().optional(),
    picName: z.string().optional(),
    status: projectStatusSchema,
  }),
  documentRelations: z.object({
    proposalIds: z.array(z.string()),
    quotationIds: z.array(z.string()),
    purchaseOrderIds: z.array(z.string()),
    invoiceIds: z.array(z.string()),
    bastIds: z.array(z.string()),
  }),
  expenses: z.array(expenseItemSchema).default([]),
  documents: z.array(projectDocumentSchema),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
