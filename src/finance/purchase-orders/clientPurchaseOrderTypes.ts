/** Client Purchase Order (PO Masuk) — incoming PO from a client. */
export interface ClientPurchaseOrder {
    id: number;
    cpoNumber: string;
    internalReference: string | null;
    projectId: number | null;
    projectName: string | null;
    clientId: number;
    clientName: string | null;
    linkedProposalId: number | null;
    linkedProposalVersion: string | null;
    amount: number;
    currency: string;
    ppnIncluded: boolean;
    issuedDate: string | null;
    receivedDate: string | null;
    validUntil: string | null;
    description: string | null;
    paymentTerms: string | null;
    status: 'RECEIVED' | 'VERIFIED' | 'EXPIRED' | 'CANCELLED';
    attachmentUrl: string | null;
    attachmentName: string | null;
    verifiedBy: number | null;
    verifiedAt: string | null;
    notes: string | null;
    createdAt: string | null;
    createdBy: number | null;
}

export interface ClientPurchaseOrderCreateInput {
    cpoNumber: string;
    clientId: number;
    projectId?: number | null;
    linkedProposalId?: number | null;
    linkedProposalVersion?: string;
    amount?: number;
    currency?: string;
    ppnIncluded?: boolean;
    issuedDate?: string;
    receivedDate?: string;
    validUntil?: string;
    description?: string;
    paymentTerms?: string;
    status?: string;
    attachmentUrl?: string;
    attachmentName?: string;
    notes?: string;
}

export type ClientPurchaseOrderUpdateInput = Partial<ClientPurchaseOrderCreateInput>;
