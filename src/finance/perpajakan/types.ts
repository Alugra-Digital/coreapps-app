/** Tax category - output (charged to client) or withholding (withheld by others) */
export type TaxCategory = "output_tax" | "withholding_tax";

/** Applicable document types */
export type ApplicableDocument = "invoice" | "po" | "bast";

/** Tax type (Perpajakan) entity */
export interface TaxType {
  id: string;
  code: string;
  name: string;
  rate: number;
  category: TaxCategory;
  description: string;
  regulation?: string;
  applicableDocuments: ApplicableDocument[];
  documentUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TaxTypeCreateInput = Omit<TaxType, "id" | "createdAt" | "updatedAt">;
export type TaxTypeUpdateInput = Partial<TaxTypeCreateInput>;
