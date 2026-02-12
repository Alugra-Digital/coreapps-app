/** Project status */
export type ProjectStatus = "on_progress" | "completed" | "cancelled";

/** Project identity - Project ID, Nama, Klien, Scope, Start/End Date, PM, Status */
export interface ProjectIdentity {
  projectId: string;
  namaProject: string;
  clientId: string;
  clientName: string;
  scopeProject: string;
  startDate: string;
  endDate: string;
  projectManagerId?: string;
  projectManagerName: string;
  status: ProjectStatus;
}

/** Document relations - Proposal, Quotation, PO, Invoice, BAST */
export interface DocumentRelations {
  proposalIds: string[];
  quotationIds: string[];
  purchaseOrderIds: string[];
  invoiceIds: string[];
  bastIds: string[];
}

/** Project finance - Income, Expense, Profit/Loss */
export interface ProjectFinance {
  income: number;
  expense: number;
  profitLoss: number;
}

/** Supporting document - link to contract, photos, files, reports */
export interface ProjectDocument {
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
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectCreateInput = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type ProjectUpdateInput = Partial<ProjectCreateInput>;
