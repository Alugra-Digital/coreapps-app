import { z } from "zod";

export const projectStatusSchema = z.enum(["on_progress", "completed", "cancelled"]);
export type ProjectStatusForm = z.infer<typeof projectStatusSchema>;

const projectDocumentSchema = z.object({
  url: z.string().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  uploadedAt: z.string().optional(),
});

export const projectFormSchema = z.object({
  identity: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    namaProject: z.string().min(1, "Project name is required"),
    clientId: z.string().min(1, "Client is required"),
    clientName: z.string().min(1, "Client name is required"),
    scopeProject: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    projectManagerId: z.string().optional(),
    projectManagerName: z.string().optional(),
    status: projectStatusSchema,
  }),
  documentRelations: z.object({
    proposalIds: z.array(z.string()),
    quotationIds: z.array(z.string()),
    purchaseOrderIds: z.array(z.string()),
    invoiceIds: z.array(z.string()),
    bastIds: z.array(z.string()),
  }),
  finance: z.object({
    income: z.number().min(0, "Income must be >= 0"),
    expense: z.number().min(0, "Expense must be >= 0"),
    profitLoss: z.number().optional(),
  }),
  documents: z.array(projectDocumentSchema),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
