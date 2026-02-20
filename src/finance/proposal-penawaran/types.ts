/** Cover info - Penawaran pekerjaan/jasa, Nama Perusahaan, Bulan proposal, Informasi Perusahaan */
export interface CoverInfo {
  jobOffer: string;
  companyName: string;
  proposalMonth: string;
  address: string;
  phone: string;
  email?: string;
  logoUrl?: string;
}

/** Client info - Target client for the proposal */
export interface ClientInfo {
  clientId?: string;
  clientName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}

/** Line item - Description, Quantity, Volume, Price */
export interface ProposalItem {
  number: number;
  description: string;
  quantity: number;
  volume: string;
  unitPrice: number;
  totalPrice: number;
}

/** Document approval - Tempat, tanggal, TTD, Nama penandatangan, Jabatan */
export interface DocumentApproval {
  place: string;
  date: string;
  signerName: string;
  signerPosition: string;
  signatureUrl?: string;
}

export type ProposalStatus = "draft" | "sent" | "accepted" | "rejected";

/** Main Proposal Penawaran entity */
export interface ProposalPenawaran {
  id: string;
  coverInfo: CoverInfo;
  proposalNumber: string;
  clientInfo: ClientInfo;
  clientBackground?: string;
  offeredSolution?: string;
  workingMethod?: string;
  timeline?: string;
  portfolio?: string;
  items: ProposalItem[];
  totalEstimatedCost: number;
  totalEstimatedCostInWords: string;
  currency: string;
  scopeOfWork: string[];
  termsAndConditions: string[];
  notes?: string;
  documentApproval: DocumentApproval;
  status: ProposalStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type ProposalPenawaranCreateInput = Omit<
  ProposalPenawaran,
  "id" | "createdAt" | "updatedAt"
>;
export type ProposalPenawaranUpdateInput = Partial<ProposalPenawaranCreateInput>;
