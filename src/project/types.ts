/** Project status - CoreApps 2.0 lifecycle */
export type ProjectStatus =
  | "PIPELINE"
  | "NEGOTIATION"
  | "WON"
  | "LOST"
  | "ON_PROGRESS"
  | "ON_HOLD"
  | "READY_TO_CLOSE"
  | "COMPLETED"
  | "CANCELLED";

/** Legacy status (backward compat) */
export type LegacyProjectStatus = "on_progress" | "completed" | "cancelled";

/** Project identity - Project ID, Nama, Klien, Scope, Start/End Date, PM, PIC, Status */
export interface ProjectIdentity {
  projectId: string;
  namaProject: string;
  projectCode?: string;
  clientId: string;
  clientName: string;
  scopeProject: string;
  description?: string;
  price?: number;
  startDate: string;
  endDate: string;
  estimatedDuration?: number;
  projectManagerId?: string;
  projectManagerName: string;
  picId?: string;
  picName?: string;
  picPosition?: string;
  picDepartment?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  tags?: string[];
  teamMembers?: ProjectTeamMember[];
  status: ProjectStatus | LegacyProjectStatus;
}

export interface ProjectTeamMember {
  employeeId: string;
  employeeName: string;
  role: string;
  assignedAt?: string;
}

/** Document relations - Proposal, CPO, Vendor Q, Vendor PO, Invoice, BAST */
export interface DocumentRelations {
  proposalIds: string[];
  quotationIds: string[];
  purchaseOrderIds: string[];
  clientPurchaseOrderIds?: string[];
  vendorQuotationIds?: string[];
  vendorPurchaseOrderIds?: string[];
  invoiceIds: string[];
  bastIds: string[];
}

/** Project finance - CoreApps 2.0 */
export interface ProjectFinance {
  income?: number;
  expense?: number;
  profitLoss?: number;
  contractValue?: number;
  currency?: string;
  ppnIncluded?: boolean;
  totalInvoiced?: number;
  totalPaid?: number;
  outstandingAmount?: number;
  totalExpense?: number;
  grossProfit?: number;
  marginPercent?: number;
  remainingToBill?: number;
  financialStatus?: "ON_TRACK" | "AT_RISK" | "OVER_BUDGET" | "COMPLETED";
  budgetAlert?: boolean;
}

/** Project termin */
export interface ProjectTermin {
  terminId: string;
  terminNumber: number;
  description: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: "SCHEDULED" | "DUE" | "INVOICED" | "PAID" | "OVERDUE";
  invoiceId?: string | null;
  paidAt?: string | null;
  notes?: string;
}

/** Project expense */
export interface ProjectExpense {
  expenseId: string;
  category: string;
  description: string;
  clientId?: string;
  clientName?: string;
  amount: number;
  date: string;
  status: string;
  phase?: "PRE_COST" | "ON_GOING";
}

/** Project milestone */
export interface ProjectMilestone {
  milestoneId: string;
  title: string;
  targetDate: string;
  completedDate?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DELAYED";
  linkedTerminId?: string;
  notes?: string;
}

/** Supporting document */
export interface ProjectDocument {
  documentId?: string;
  url: string;
  name: string;
  type: string;
  uploadedAt: string;
}

/** Main Project entity */
export interface Project {
  id: string;
  identity: ProjectIdentity;
  documentRelations: DocumentRelations;
  finance: ProjectFinance;
  documents: ProjectDocument[];
  termin?: ProjectTermin[];
  expenses?: ProjectExpense[];
  milestones?: ProjectMilestone[];
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectCreateInput = Omit<Project, "id" | "createdAt" | "updatedAt" | "expenses"> & {
  expenses?: ExpenseInput[];
};
export type ProjectUpdateInput = Partial<ProjectCreateInput>;

/** Simplified expense payload for create/update (server assigns expenseId, category, status) */
export interface ExpenseInput {
  description: string;
  date: string;
  amount: number;
  phase: "PRE_COST" | "ON_GOING";
}
