export interface QuotationLineItem {
  number: number;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired" | "negotiation";

export interface Quotation {
  id: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil?: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  serviceOffered: string;
  quotationMonth: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  taxAmount: number;
  taxTypeId?: string;
  grandTotal: number;
  paymentTerms?: string;
  validityPeriod?: string;
  termsConditions?: string;
  status: QuotationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type QuotationCreateInput = Omit<Quotation, "id" | "createdAt" | "updatedAt">;
export type QuotationUpdateInput = Partial<QuotationCreateInput>;
